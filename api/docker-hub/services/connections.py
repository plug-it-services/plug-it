import os
import sqlalchemy
from sqlalchemy.orm import Session

from models.Connection import Connection


class ConnectionsService:

    def __init__(self):
        conn_string = "postgresql+psycopg2://{0}:{1}@{2}:{3}/{4}".format(
            os.environ.get('POSTGRES_USER'),
            os.environ.get('POSTGRES_PASSWORD'),
            os.environ.get('POSTGRES_HOST'),
            os.environ.get('POSTGRES_PORT'),
            os.environ.get('POSTGRES_DB')
        )
        self.conn = sqlalchemy.create_engine(conn_string)
        Connection.metadata.create_all(self.conn)

    def save(self, connection: Connection):
        with Session(self.conn) as session:
            session.add(connection)
            session.commit()

    def get(self, user_id: int):
        with Session(self.conn) as session:
            stmt = sqlalchemy.select(Connection).where(Connection.user_id == user_id)
            return session.execute(stmt).first()

    def update(self, user_id, connection: Connection):
        with Session(self.conn) as session:
            stmt = sqlalchemy.update(Connection).where(Connection.user_id == user_id).values(
                username=connection.username,
                token=connection.token,
                jwt=connection.jwt
            )
            session.execute(stmt)
            session.commit()

    def delete(self, user_id: int):
        with Session(self.conn) as session:
            stmt = sqlalchemy.delete(Connection).where(Connection.user_id == user_id)
            session.execute(stmt)
            session.commit()