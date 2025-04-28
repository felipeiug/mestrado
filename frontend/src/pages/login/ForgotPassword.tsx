import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Box, Alert, Snackbar } from '@mui/material';
import { AuthFormContainer } from '../../components';
import { useApi } from '../../services';
import { useError, useLoading } from '../../context';

export const ForgotPassword = () => {
  const api = useApi();
  const setError = useError();
  const navigate = useNavigate();
  const setLoading = useLoading();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading({ open: true });
    const value = await api.login.sendResetCode(email);
    setLoading({ open: false });

    if ("error" in value) {
      setError(value);
      return;
    }
    setMessage(`Enviaremos um link de recuperação para o e-mail ${email}`);
  };

  return (
    <>


      {message && (
        <Snackbar
          open={Boolean(message)}
          autoHideDuration={6000}
          onClose={() => setMessage(undefined)}
        >
          <Alert severity={'success'} sx={{ mb: 2 }}>
            {message}
          </Alert>
        </Snackbar>
      )}

      <AuthFormContainer title="Recuperar Senha">
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
    </>
  );
};