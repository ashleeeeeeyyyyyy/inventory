from falcon_autocrud.resource import CollectionResource, SingleResource
from inv_syst.model import *
import falcon
import json


class EmployeeCollectionResource(CollectionResource):
    model = Employee


class EmployeeResource(SingleResource):
    model = Employee


class InventoryCollectionResource(CollectionResource):
    model = Inventory


class InventoryResource(SingleResource):
    model = Inventory


class TransactionCollectionResource(CollectionResource):
    model = Transaction


class TransactionResource(SingleResource):
    model = Transaction


class TransactionDetailCollectionResource(CollectionResource):
    model = TransactionDetail


class TransactionDetailResource(SingleResource):
    model = TransactionDetail


class SupplierCollectionResource(CollectionResource):
    model = Supplier


class SupplierResource(SingleResource):
    model = Supplier


class InsertTransactionDetails(object):

    def on_post(self, req, resp):
        request = json.loads(req.bounded_stream.read().decode())

        # Validate stock levels before deducting to prevent negative inventory
        for item in request['transaction_details']:
            inventory_item = self.session.query(Inventory).filter(
                Inventory.item_id == item['item_id']
            ).with_for_update().first()

            if inventory_item is None:
                raise falcon.HTTPBadRequest(
                    title='Item Not Found',
                    description=f"Item '{item['item_name']}' not found in inventory."
                )

            if inventory_item.current_inventory < item['units_sold']:
                raise falcon.HTTPConflict(
                    title='Insufficient Stock',
                    description=f"Not enough stock for '{item['item_name']}'. "
                                f"Available: {inventory_item.current_inventory}, "
                                f"Requested: {item['units_sold']}."
                )

        self.session.bulk_insert_mappings(TransactionDetail, request['transaction_details'])
        self.session.bulk_update_mappings(Inventory, request['new_inventory'])
        self.session.commit()

        resp.body = json.dumps(request, ensure_ascii=False)
        resp.status = falcon.HTTP_201


class HealthCheck(object):

    def on_get(self, req, resp):

        status = {
            'API Accessible': True
        }

        resp.body = json.dumps(status, ensure_ascii=False)
        resp.status = falcon.HTTP_200
