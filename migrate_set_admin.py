import asyncio
from sqlalchemy import text
from database import engine

async def set_admin_role():
    """
    Устанавливает роль ADMIN для пользователя с email admin@example.com
    """
    async with engine.begin() as conn:
        try:
            # Обновляем роль на ADMIN для пользователя с указанным email
            await conn.execute(text("""
                UPDATE users
                SET role = 'ADMIN'
                WHERE email = 'admin@example.com'
            """))
            print("✅ Роль ADMIN успешно установлена для пользователя admin@example.com")
        except Exception as e:
            print(f"❌ Ошибка при установке роли: {e}")
        
        print("Migration completed!")

if __name__ == "__main__":
    asyncio.run(set_admin_role())