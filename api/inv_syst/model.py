from sqlalchemy import Column, Float, ForeignKey, Integer
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Employee(Base):
    __tablename__ = 'employees'

    idemployees = Column(Integer, primary_key=True)
    name = Column(VARCHAR(45), nullable=False)
    birthday = Column(VARCHAR(45), nullable=False)
    contact_number = Column(VARCHAR(45), nullable=False)
    position = Column(VARCHAR(45), nullable=False)
    date_joined = Column(VARCHAR(45), nullable=False)


class Inventory(Base):
    __tablename__ = 'inventory'

    item_id = Column(VARCHAR(45), primary_key=True)
    spec_code = Column(VARCHAR(45))
    item_name = Column(VARCHAR(45), nullable=False)
    current_inventory = Column(Integer, nullable=False)
    selling_price = Column(Float(asdecimal=True), nullable=False)
    buying_price = Column(Float(asdecimal=True), nullable=False)
    category = Column(VARCHAR(45), nullable=False)


class Supplier(Base):
    __tablename__ = 'suppliers'

    idsuppliers = Column(Integer, primary_key=True)
    name = Column(VARCHAR(45), nullable=False)
    contact_number = Column(VARCHAR(45), nullable=False)


class Transaction(Base):
    __tablename__ = 'transactions'

    special_id = Column(Integer, primary_key=True)
    transaction_id = Column(VARCHAR(45), nullable=False)
    total_price = Column(Float(asdecimal=True), nullable=False)
    notes = Column(VARCHAR(450), nullable=False)
    transaction_date = Column(VARCHAR(45), nullable=False)
    customer_name = Column(VARCHAR(255), nullable=False)
    customer_address = Column(VARCHAR(500), nullable=False)
    customer_contact_number = Column(VARCHAR(45), nullable=False)
    delivery_fee = Column(Float(asdecimal=True), nullable=False)
    discount = Column(Float(asdecimal=True), nullable=False)


class TransactionDetail(Base):
    __tablename__ = 'transaction_details'

    item_id = Column(VARCHAR(45), primary_key=True, nullable=False)
    special_id = Column(ForeignKey('transactions.special_id'), primary_key=True, nullable=False, index=True)
    item_name = Column(VARCHAR(45), nullable=False)
    units_sold = Column(Integer, nullable=False)
    selling_price = Column(Float(asdecimal=True), nullable=False)
    total_price = Column(Float(asdecimal=True), nullable=False)

    special = relationship('Transaction')