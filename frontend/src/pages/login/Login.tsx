import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Box } from '@mui/material';
import { AuthFormContainer } from '../../components';
import { useApi } from '../../services';
import { useError } from '../../context';

export const Login = () => {
  const api = useApi();
  const setError = useError();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    api.login.login(email, password).then(login => {
      if ("error" in login) {
        setError(login);
        return;
      }
      localStorage.setItem("authToken", login.token);
      navigate("/app");
    });
  };

  return (
    <AuthFormContainer title="Login">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Entrar
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="" onClick={() => navigate('/forgot-password')} variant="body2">
            Esqueceu a senha?
          </Link>
          <Link href="" onClick={() => navigate('/register')} variant="body2">
            Criar conta
          </Link>
        </Box>
      </form>
    </AuthFormContainer>
  );
};