import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Scale, AlertCircle } from 'lucide-react';
import { API_CONFIG } from '../../config';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Login attempt started');
    const backendUrl = API_CONFIG.BACKEND_URL;
    console.log('Backend URL:', backendUrl);
    console.log('Credentials:', credentials);

    try {
      const apiUrl = `${backendUrl}/api/admin/login`;
      console.log('Full API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_user', JSON.stringify({
          user_id: data.user_id,
          username: data.username
        }));
        onLogin(data);
        navigate('/admin/dashboard');
      } else {
        const errorData = await response.json();
        console.log('Login failed:', errorData);
        setError(errorData.detail || 'Giriş başarısız');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Mock data fallback for development
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        console.log('Using mock login');
        const mockData = {
          access_token: 'mock_token_' + Date.now(),
          user_id: 'mock_user_id',
          username: 'admin'
        };
        
        localStorage.setItem('admin_token', mockData.access_token);
        localStorage.setItem('admin_user', JSON.stringify({
          user_id: mockData.user_id,
          username: mockData.username
        }));
        onLogin(mockData);
        navigate('/admin/dashboard');
      } else {
        setError('Bağlantı hatası. Lütfen tekrar deneyin. (Mock: admin/admin123)');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Panel
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Legal Design Turkey Yönetim Paneli
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              Yönetim paneline erişmek için kimlik bilgilerinizi girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Kullanıcı Adı
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Şifrenizi girin"
                />
              </div>

              {error && (
                <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-md">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600">
                <strong>Test Bilgileri:</strong><br />
                Kullanıcı Adı: admin<br />
                Şifre: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;