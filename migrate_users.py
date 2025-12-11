import asyncio
from sqlalchemy import text
from database import engine

async def create_users_table():
    async with engine.begin() as conn:
        try:
            # Create users table
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    nickname VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    hashed_password VARCHAR(255) NOT NULL,
                    role VARCHAR(10) NOT NULL DEFAULT 'user'
                )
            """))
            print("Table users created successfully")
        except Exception as e:
            print(f"Error creating users table: {e}")
        
        try:
            # Create indexes for users table
            await conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname)
            """))
            await conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
            """))
            print("Indexes for users table created successfully")
        except Exception as e:
            print(f"Error creating indexes for users: {e}")
        
        try:
            # Add user_id column to tasks table
            await conn.execute(text("""
                ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id INTEGER
            """))
            print("Column user_id added to tasks table successfully")
        except Exception as e:
            print(f"Error adding user_id column: {e}")
        
        try:
            # Add foreign key constraint
            await conn.execute(text("""
                ALTER TABLE tasks
                ADD CONSTRAINT fk_tasks_user_id
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            """))
            print("Foreign key constraint added successfully")
        except Exception as e:
            print(f"Error adding foreign key constraint: {e}")
        
        try:
            # Create index for user_id in tasks table
            await conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)
            """))
            print("Index for user_id in tasks table created successfully")
        except Exception as e:
            print(f"Error creating index for user_id: {e}")
        
        print("Migration completed!")

if __name__ == "__main__":
    asyncio.run(create_users_table())