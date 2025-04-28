import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { AuthFormContainer } from '../../components';
import { useError } from '../../context/ErrorContext';
import { useApi } from '../../services';
import { useLoading } from '../../context';

export const ResetPassword = () => {
  const api = useApi();
  const setError = useError();
  const navigate = useNavigate();
  const setLoading = useLoading();

  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError({
        error: 'Erro',
        message: 'As senhas não coincidem',
      });
      return;
    }

    setLoading({ open: true });
    const login = await api.login.changePassw(password, token ?? '');
    setLoading({ open: false });

    if ("error" in login) {
      setError(login);
      return;
    }

    localStorage.setItem("authToken", login.token);
    navigate('/app');
  };

  return (
    <AuthFormContainer title="Redefinir Senha">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nova senha"
          type="password"
          fullWidth
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Confirmar nova senha"
          type="password"
          fullWidth
          margin="normal"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Redefinir Senha
        </Button>
      </form>
    </AuthFormContainer>
  );
};