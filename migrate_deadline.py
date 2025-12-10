import asyncio
from sqlalchemy import text
from database import engine

async def add_deadline_column():
    async with engine.begin() as conn:
        try:
            # Add deadline_at column
            await conn.execute(text("""
                ALTER TABLE tasks 
                ADD COLUMN deadline_at TIMESTAMP WITH TIME ZONE
            """))
            print("Column deadline_at added successfully")
        except Exception as e:
            print(f"Error adding deadline_at column: {e}")
        
        try:
            # Drop is_urgent column
            await conn.execute(text("""
                ALTER TABLE tasks 
                DROP COLUMN IF EXISTS is_urgent
            """))
            print("Column is_urgent dropped successfully")
        except Exception as e:
            print(f"Error dropping is_urgent column: {e}")
        
        print("Migration completed!")

if __name__ == "__main__":
    asyncio.run(add_deadline_column())