// src/pages/users/Users.tsx
import { useState, useEffect } from 'react';
import { User, UserService } from '../services/UserService'; // Імпорт сервісу
import { AxiosError } from 'axios'; // Імпорт AxiosError для обробки помилок

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController(); // Створення контролера для скасування запитів
    const signal = abortController.signal;

    const userService = new UserService(signal); // Ініціалізація сервісу

    const fetchUsers = async () => {
      try {
        setLoading(true); // Початок завантаження
        setError(null); // Скидання помилки

        const fetchedUsers = await userService.getAllUsers(); // Отримання користувачів
        setUsers(fetchedUsers); // Збереження користувачів у стані
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.message); // Обробка помилок Axios
        } else {
          setError('An unexpected error occurred'); // Обробка інших помилок
        }
      } finally {
        setLoading(false); // Завершення завантаження
      }
    };

    fetchUsers();

    return () => {
      abortController.abort(); // Скасування запиту при розмонтуванні
    };
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {loading && <p>Loading...</p>}{' '}
      {/* Відображення індикатора завантаження */}
      {error && <p>Error: {error}</p>} {/* Відображення помилки */}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name.firstname} {user.name.lastname} - {user.email}{' '}
            {/* Відображення імені, прізвища та електронної пошти */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
