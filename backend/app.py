from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import hashlib

app = Flask(__name__)

from flask_cors import CORS
CORS(app)

# MySQL Configuration
app.config['MYSQL_HOST'] = "localhost"
app.config['MYSQL_USER'] = "root"
app.config['MYSQL_PASSWORD'] = ""
app.config['MYSQL_DB'] = "ecommercedatabase"

mysql = MySQL(app)

# Hashing function for passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Validation functions
def validateInt(input):
    if (not input):
        return False
    
    return True

def validateString(input):
    if ("'" in input or "\"" in input or not input):
        return False

    return True

# Route for testing the API, returns a simple message 
@app.route('/')
def index():
    return "API is running!"

# Route for creating a new user via POST request
# Expects JSON with username, password, email, firstname, lastname, and address
@app.route('/createuser', methods=["POST"])
def create_user():
    data = request.get_json()
    query = "INSERT INTO user (Username, Password, Email, FirstName, LastName, Address) VALUES (%s, %s, %s, %s, %s, %s)"

    values = (
        data.get('username'),
        hash_password(data.get('password')),
        data.get('email'),
        data.get('firstname'),
        data.get('lastname'),
        data.get('address')
    )

    if (not (validateString(values[0]) and data.get('password') and validateString(values[2]))):
        return  jsonify("Bad data"), 400
    
    # check if user with this username or email exists
    find_user = "SELECT UserID from user WHERE Username = %s OR Email = %s"
    user_values = (values[0], values[2])

    cur = mysql.connection.cursor()
    existing_user = cur.execute(find_user, user_values)
    cur.close()

    if ((not existing_user)):
        cur = mysql.connection.cursor()
        cur.execute(query, values)
        mysql.connection.commit()
        cur.close()
        return jsonify("User created"), 201
    else:
        return jsonify("User already exists"), 409

# Route for retrieving products via GET request, with optional filters for brand and category
@app.route('/products', methods=["GET"])
def return_products():
    query = "SELECT * FROM Product WHERE 1=1"
    params = []

    if 'brand' in request.args:
        if (not validateString(request.args['brand'])):
            return jsonify("bad data"), 400
        query += " AND BrandID = (SELECT BrandID FROM Brand WHERE Name = %s)"
        params.append(request.args['brand'])

    if 'category' in request.args:
        if (not validateString(request.args['category'])):
            return jsonify("bad data"), 400
        query += " AND CategoryID = (SELECT CategoryID FROM Category WHERE Name = %s)"
        params.append(request.args['category'])

    cur = mysql.connection.cursor()
    products = cur.execute(query, params)

    if products:
        products = cur.fetchall()
        column_names = [desc[0] for desc in cur.description]
        cur.close()
        results = [dict(zip(column_names, row)) for row in products]
        return jsonify(results), 200
    else:
        return jsonify('No products matching search'), 204

# Route for creating an order via POST request
# Expects JSON with username, password, payment method, and a list of items (product name and quantity)
@app.route('/createorder', methods=["POST"])
def create_order():
    data = request.get_json()
    username = data.get('username')
    password_hash = hash_password(data.get('password'))

    if not validateString(username) or not validateString(data.get('paymentmethod')):
        return jsonify("Bad data"), 400

    query = "SELECT UserID FROM user WHERE Username = '" + username + "' AND Password = '" + password_hash + "'"

    cur = mysql.connection.cursor()
    cur.execute(query)
    userId = cur.fetchone()
    cur.close()

    # Authentication, only create order if user exists and password OK
    if userId:
        
        # check items and stock
        items = data.get('items')
        if not items:
            return jsonify("Bad data"), 400 
        if not len(items):
            return jsonify("Bad data"), 400
            
        approvedItems = []
        for productName, orderQuantity in items.items():
            cur = mysql.connection.cursor()
            query = "SELECT * FROM product WHERE Name = '" + productName + "' AND StockQuantity >= " + str(orderQuantity)
            if not validateString(productName) or not validateInt(orderQuantity):
                return jsonify("Bad data"), 400

            cur.execute(query)
            item = cur.fetchone()
            cur.close()
            if item:
                approvedItems.append({"quantity": orderQuantity, 
                                      "newStock": item[4] - orderQuantity,
                                      "price": item[3], 
                                      "productID": item[0]})
            else:
                return jsonify("Product does not exist or too low stock"), 404
                
        # create order
        query = "INSERT INTO `order` (UserID, TotalAmount) VALUES (%s, %s)"

        total_amount = sum([productInfo["quantity"] * productInfo["price"] for productInfo in approvedItems])

        values = (
            userId[0],
            total_amount
        )

        cur = mysql.connection.cursor()
        cur.execute(query, values)
        order_id = cur.lastrowid # get the order ID of newly created order

        mysql.connection.commit()
        cur.close()
       
        # create orderitems
        for productInfo in approvedItems:
            cur = mysql.connection.cursor()
            query = "INSERT INTO orderitem (OrderID, ProductID, Quantity, Subtotal) VALUES (%s, %s, %s, %s) "
            values = (
                order_id,
                productInfo["productID"],
                productInfo["quantity"],
                productInfo["quantity"] * productInfo["price"]
            )

            update_stock = "UPDATE product SET StockQuantity = %s WHERE productID = %s" # LOWER STOCK
            stock_values = (
                productInfo["newStock"],
                productInfo["productID"]
            )

            cur = mysql.connection.cursor()

            cur.execute(query, values)
            cur.execute(update_stock, stock_values)
            mysql.connection.commit()
            cur.close()

        # create payment
        
        query = "INSERT into payment (OrderID, PaymentMethod, Amount) VALUES (%s, %s, %s)"
        values = (
            order_id,
            data.get("paymentmethod"),
            total_amount
        )

        
        
        cur = mysql.connection.cursor()
        cur.execute(query, values)
        mysql.connection.commit()
        cur.close()
            
        return jsonify({"orderID": order_id, "totalAmount": total_amount}), 200
    else:
        return jsonify('Wrong username or password'), 401
 
# Routes for retrieving all categories and brands via GET request
@app.route('/categories', methods=["GET"])
def get_categories():
    cur = mysql.connection.cursor()
    cur.execute("SELECT Name FROM Category")
    categories = [row[0] for row in cur.fetchall()]
    cur.close()
    return jsonify(categories), 200

@app.route('/brands', methods=["GET"])
def get_brands():
    cur = mysql.connection.cursor()
    cur.execute("SELECT Name FROM Brand")
    brands = [row[0] for row in cur.fetchall()]
    cur.close()
    return jsonify(brands), 200 

if __name__ == "__main__":
    app.run(debug=True)