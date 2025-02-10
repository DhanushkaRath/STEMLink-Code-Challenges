Entities

User: The person placing the order.
Product: The items being ordered.
Order: A collection of products purchased by a user.
OrderItem: connects an order to the products, storing the quantity and price of each product in the order.
ShippingAddress: Stores the delivery details for an order.
Payment: Tracks the payment status of an order. 


Relationships

A User can place multiple Orders (One-to-Many).
An Order can contain multiple Products, and a Product can belong to multiple Orders (Many-to-Many).
An Order has one Shipping Address (One-to-One).
An Order has one Payment status (One-to-One).

