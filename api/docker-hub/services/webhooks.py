import os
import sqlalchemy
from sqlalchemy.orm import Session
from models.Webhook import Webhook


class WebhooksService:

    def __init__(self):
        conn_string = "postgresql+psycopg2://{0}:{1}@{2}:{3}/{4}".format(
            os.environ.get('POSTGRES_USER'),
            os.environ.get('POSTGRES_PASSWORD'),
            os.environ.get('POSTGRES_HOST'),
            os.environ.get('POSTGRES_PORT'),
            os.environ.get('POSTGRES_DB')
        )
        self.conn = sqlalchemy.create_engine(conn_string)
        Webhook.metadata.create_all(self.conn)

    def save(self, webhook: Webhook):
        with Session(self.conn) as session:
            session.add(webhook)
            session.commit()

    def get(self, id: str):
        with Session(self.conn) as session:
            stmt = sqlalchemy.select(Webhook).where(Webhook.id == id)
            return session.scalars(stmt).first()

    def get_by_user_id(self, user_id: int):
        with Session(self.conn) as session:
            stmt = sqlalchemy.select(Webhook).where(Webhook.user_id == user_id)
            return session.scalars(stmt).first()

    def get_by_plug_id(self, plug_id: str):
        with Session(self.conn) as session:
            stmt = sqlalchemy.select(Webhook).where(Webhook.plug_id == plug_id)
            return session.scalars(stmt).first()

    def delete(self, id: str):
        with Session(self.conn) as session:
            stmt = sqlalchemy.delete(Webhook).where(Webhook.id == id)
            session.execute(stmt)
            session.commit()