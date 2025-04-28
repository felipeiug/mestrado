import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Box, Grid, Autocomplete, Skeleton } from '@mui/material';
import { AuthFormContainer } from '../../components';
import { useApi } from '../../services';
import { useError, useLoading } from '../../context';
import { UserWithPasswords } from '../../services/api/login';

export const Register = () => {
  const api = useApi();
  const navigate = useNavigate();
  const setError = useError();
  const setLoading = useLoading();

  const [universityText, setUniversityText] = useState('');
  const [universityOptions, setUniversityOptions] = useState<{ [key: string]: string; }>({});
  const [user, setUser] = useState<UserWithPasswords>({
    id: "",
    name: "",
    email: "",
    password: "",
    admin: false,
    status: true,
    validEmail: true,
    confirmPassword: "",
    insertDate: new Date(),
  });

  useEffect(() => {
    api.university.getAll(universityText).then(setUniversityOptions);
  }, [universityText]);

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
        <Grid container columnSpacing={"0.5em"} rowSpacing={0}>
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

          <Grid size={12} sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
            {Object.keys(universityOptions).length === 0 ? <div style={{ flex: 1 }}> <Skeleton height="6em" /> </div> :
              <Autocomplete
                freeSolo
                fullWidth
                options={Object.values(universityOptions)}
                value={universityOptions[user.universityId ?? ''] ?? universityText}
                onChange={(_, newValue) => setUser({
                  ...user,
                  universityId: Object.keys(universityOptions).filter(key => universityOptions[key] === newValue)[0],
                })}
                onInputChange={(_, newInputValue) => {
                  const matches = Object.keys(universityOptions).filter(key => universityOptions[key] === newInputValue);
                  if (matches.length > 0) {
                    setUser({
                      ...user,
                      universityId: matches[0],
                    });
                    return;
                  }
                  setUniversityText(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Universidade"
                    margin="normal"
                  />
                )}
                filterOptions={(options, state) => options.filter(option => option.toLowerCase().includes(state.inputValue.toLowerCase()))}
                sx={{ mt: 2 }}
              />}
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