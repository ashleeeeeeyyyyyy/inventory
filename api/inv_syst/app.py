from sqlalchemy import create_engine
from falcon_autocrud.middleware import Middleware
from inv_syst.resources import *
from inv_syst.cors import HandleCORS
from inv_syst.sessions import ScopedSession
from inv_syst.SQLMiddleware import SQLAlchemySessionManager
import falcon


db_url = 'mysql+mysqldb://root:root@mysql:3306/inv_syst'
db_engine = create_engine(db_url)
scoped_sessions = ScopedSession(db_engine=db_engine)
Sessions = scoped_sessions.create_session()

app = application = falcon.API(middleware=[HandleCORS(), Middleware(), SQLAlchemySessionManager(Sessions)])

app.add_route('/health', HealthCheck())
app.add_route('/employee', EmployeeCollectionResource(db_engine))
app.add_route('/employee/{idemployees}', EmployeeResource(db_engine))
app.add_route('/inventory', InventoryCollectionResource(db_engine))
app.add_route('/inventory/{item_id}', InventoryResource(db_engine))
app.add_route('/transactions', TransactionCollectionResource(db_engine))
app.add_route('/transactions/{special_id}', TransactionResource(db_engine))
app.add_route('/tdetails', TransactionDetailCollectionResource(db_engine))
app.add_route('/tdetails/{special_id}', TransactionDetailResource(db_engine))
app.add_route('/supplier', SupplierCollectionResource(db_engine))
app.add_route('/supplier/{idsuppliers}', SupplierResource(db_engine))
app.add_route('/transactions/create', InsertTransactionDetails())
