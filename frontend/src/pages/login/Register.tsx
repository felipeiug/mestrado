import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Box, Grid, Checkbox, Typography } from '@mui/material';
import { AuthFormContainer } from '../../components';
import { useApi } from '../../services';
import { useError, useLoading } from '../../context';
import { UserWithPasswords } from '../../services/api/login';

export const Register = () => {
  const api = useApi();
  const navigate = useNavigate();
  const setError = useError();
  const setLoading = useLoading();

  const [university, setUniversity] = useState(false);
  const [user, setUser] = useState<UserWithPasswords>({
    id: "",
    name: "",
    email: "",
    password: "",
    admin: false,
    status: true,
    confirmPassword: "",
    insertDate: new Date(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setError({
        error: "Arro ao Criar Usuário",
        message: 'As senhas não coincidem',
      });
      return;
    }

    setLoading({ open: true });
    const login = await api.login.newUser(user);
    setLoading({ open: false });

    if ("error" in login) {
      setError(login);
      return;
    }

    localStorage.setItem("authToken", login.token);
    navigate("/app");
  };

  return (
    <AuthFormContainer title="Cadastro">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={"0.5em"}>
          <Grid size={12}>
            <TextField
              required
              fullWidth
              margin="normal"
              label="Nome do Usuário"
              value={user.name}
              onChange={(e) => setUser({
                ...user,
                name: e.target.value,
              })}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={user.email}
              onChange={(e) => setUser({
                ...user,
                email: e.target.value,
              })}
            />
          </Grid>

          <Grid size={8} sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
            {university && <TextField
              fullWidth
              type="text"
              margin="normal"
              label="Universidade"
              value={user.university}
              onChange={(e) => setUser({
                ...user,
                university: e.target.value,
              })}
            />}
          </Grid>

          <Grid size={4} sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              title='Selecionar Universidade'
              checked={university}
              onChange={(_, checked) => {
                setUniversity(checked);
                if (!checked) setUser({ ...user, university: undefined });
              }}
            />
            <Typography>
              Universidade
            </Typography>
          </Grid>


          <Grid size={6}>
            <TextField
              label="Senha"
              type="password"
              fullWidth
              margin="normal"
              required
              value={user.password}
              onChange={(e) => setUser({
                ...user,
                password: e.target.value,
              })}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Confirmar senha"
              type="password"
              fullWidth
              margin="normal"
              required
              value={user.confirmPassword}
              onChange={(e) => setUser({
                ...user,
                confirmPassword: e.target.value,
              })}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Cadastrar
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link href="" onClick={() => navigate('/login')} variant="body2">
            Já tem uma conta? Faça login
          </Link>
        </Box>
      </form>
    </AuthFormContainer >
  );
};