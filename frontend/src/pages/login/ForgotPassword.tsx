import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Alert, Box } from '@mui/material';
import { AuthFormContainer } from '../../components';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Password recovery requested for:', email);
      setMessage('Se o email existir, enviaremos um link de recuperação');
      // navigate('/reset-password'); // Redirecionar após envio
    } catch (err) {
      setMessage('Erro ao solicitar recuperação');
    }
  };

  return (
    <AuthFormContainer title="Recuperar Senha">
      {message && (
        <Alert severity={message.includes('Erro') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

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

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Enviar Código
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link href="" onClick={() => navigate('/login')} variant="body2">
            Voltar para login
          </Link>
        </Box>
      </form>
    </AuthFormContainer>
  );
};