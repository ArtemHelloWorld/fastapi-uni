import asyncio
from sqlalchemy import text
from database import engine

async def add_user_to_tasks():
    """
    Добавляет колонку user_id в таблицу tasks с внешним ключом на users
    """
    async with engine.begin() as conn:
        try:
            # Проверяем, существует ли колонка user_id
            result = await conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name='tasks' AND column_name='user_id'
            """))
            column_exists = result.fetchone() is not None
            
            if not column_exists:
                # Добавляем колонку user_id (сначала nullable)
                await conn.execute(text("""
                    ALTER TABLE tasks
                    ADD COLUMN user_id INTEGER
                """))
                print("✅ Column user_id added successfully")
            else:
                print("ℹ️  Column user_id already exists, skipping creation")
        except Exception as e:
            print(f"❌ Error adding user_id column: {e}")
        
        try:
            # Устанавливаем user_id = 1 для task с id = 1
            await conn.execute(text("""
                UPDATE tasks
                SET user_id = 1
                WHERE id = 1
            """))
            print("✅ Task id=1 linked to user id=1")
        except Exception as e:
            print(f"❌ Error linking task to user: {e}")
        
        try:
            # Устанавливаем user_id = 1 для всех остальных задач (если есть)
            await conn.execute(text("""
                UPDATE tasks
                SET user_id = 1
                WHERE user_id IS NULL
            """))
            print("✅ All other tasks linked to user id=1")
        except Exception as e:
            print(f"❌ Error setting default user_id: {e}")
        
        try:
            # Делаем колонку NOT NULL
            await conn.execute(text("""
                ALTER TABLE tasks
                ALTER COLUMN user_id SET NOT NULL
            """))
            print("✅ Column user_id set to NOT NULL")
        except Exception as e:
            print(f"❌ Error setting NOT NULL constraint: {e}")
        
        try:
            # Создаем индекс на user_id
            await conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_tasks_user_id ON tasks(user_id)
            """))
            print("✅ Index on user_id created successfully")
        except Exception as e:
            print(f"❌ Error creating index: {e}")
        
        try:
            # Проверяем, существует ли внешний ключ
            result = await conn.execute(text("""
                SELECT constraint_name
                FROM information_schema.table_constraints
                WHERE table_name='tasks' AND constraint_name='fk_tasks_user_id'
            """))
            fk_exists = result.fetchone() is not None
            
            if not fk_exists:
                # Добавляем внешний ключ
                await conn.execute(text("""
                    ALTER TABLE tasks
                    ADD CONSTRAINT fk_tasks_user_id
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                """))
                print("✅ Foreign key constraint added successfully")
            else:
                print("ℹ️  Foreign key constraint already exists, skipping creation")
        except Exception as e:
            print(f"❌ Error adding foreign key: {e}")
        
        print("Migration completed!")

if __name__ == "__main__":
    asyncio.run(add_user_to_tasks())