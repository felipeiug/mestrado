import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { AuthFormContainer } from '../../components';
import { useError } from '../../context/ErrorContext';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const setError = useError();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError({
        error: 'Problemas ao Atualizar Senha',
        message: 'As senhas não coincidem',
      });
      return;
    }

    // TODO: Alterar pro loguin no server
    console.log(token);
    navigate('/login');

    // try {
    //   navigate('/login');
    // } catch (err) {
    //   setMessage('Erro ao redefinir senha');
    // }
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