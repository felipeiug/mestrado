import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  useTheme,
  useMediaQuery,
  Toolbar,
  CardMedia,
  Divider,
  CardActionArea,
  Container,
  IconButton
} from '@mui/material';
import Logo from "../../assets/logo.jpg";
import { ParticleGraph } from '../../components/randomANN';
import { useNavigate } from 'react-router-dom';
import { Project, useError, useLoading, useUser } from '../../context';
import { useApi } from '../../services';
import { NewProjectModal } from '../../components/projects';
import { DeleteForever, Edit } from '@mui/icons-material';
import { ConfirmModal } from '../../components';

export const ProjectsPage: React.FC = () => {
  const api = useApi();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useUser();
  const setLoading = useLoading();
  const setError = useError();

  const [openNew, setOpenNew] = useState<boolean>(false);
  const [editProject, setEditProject] = useState<{ id: number; name: string; description?: string; }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectToRemove, setProjectToRemove] = useState<number>();

  useEffect(() => {
    setLoading({ open: true });
    if (!user) return;

    api.projects.getAllProjects().then(value => {
      if ("error" in value) {
        setError(value);
        setLoading({ open: false });
        return;
      }
      setProjects(value);
      setLoading({ open: false });
    });
  }, [user]);

  const handleNewEditProject = (name: string, description?: string, id?: number) => {
    setLoading({ open: true });

    if (!id) {
      api.projects.addProject({
        id: -1,
        user: "",
        name: name,
        description: description,
        insertDate: new Date(),
      }).then(value => {
        if ("error" in value) {
          setError(value);
          setLoading({ open: false });
          return;
        }

        projects.push(value);
        setProjects([...projects]);
        setLoading({ open: false });
      });
    } else {
      api.projects.updateProject({
        id: id,
        user: "",
        name: name,
        description: description,
        insertDate: new Date(),
      }).then(value => {
        if ("error" in value) {
          setError(value);
          setLoading({ open: false });
          return;
        }

        setProjects(projects.map(proj => {
          if (proj.id === id) return value;
          return proj;
        }));
        setLoading({ open: false });
      });
    }

    setProjectToRemove(undefined);
    setOpenNew(false);
  };

  const handleRemoveProject = () => {
    if (!projectToRemove) return;

    setProjectToRemove(undefined);

    setLoading({ open: true });
    api.projects.deleteProject(projectToRemove).then(value => {
      if ("error" in value) {
        setError(value);
        setLoading({ open: false });
        return;
      }

      setProjects(projects.filter(proj => proj.id !== projectToRemove));
      setLoading({ open: false });
    })
  };

  if (!user) return <></>;

  return (
    <>
      {/* Modal do novo projeto */}
      <NewProjectModal
        open={openNew || Boolean(editProject)}
        initialProject={editProject}
        onClose={() => {
          setOpenNew(false);
          setEditProject(undefined);
        }}
        onCreate={handleNewEditProject}
      />

      {/* Confirmação */}
      <ConfirmModal
        open={Boolean(projectToRemove)}
        onCancel={() => setProjectToRemove(undefined)}
        onConfirm={handleRemoveProject}
        title='Remove Project?'
        message='This action is irreversible!'
      />

      {/* Tela */}
      <Box
        sx={{
          height: '100vh',
          fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
          overflowX: 'hidden',
          display: "flex",
          flexDirection: "column",
          pb: "1em",
        }}
      >
        {/* Header */}
        <Toolbar>
          <Box sx={{ width: 32, height: 32 }}>
            <CardMedia
              onClick={() => navigate("/app/user")}
              component="img"
              image={Logo}
              alt="Imagem"
              sx={{
                width: '100%',
                height: '100%',
                cursor: "pointer",
                objectFit: 'cover',
                objectPosition: 'center center',
                borderRadius: "50%"
              }}
            />
          </Box>
          <div style={{ width: "1em" }} />
          <Typography fontWeight={"bold"} color='textPrimary'>
            {user.name}
          </Typography>

          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end', gap: 4 }}>
            <Button
              onClick={() => setOpenNew(true)}
              variant="contained"
              sx={{
                minWidth: 84,
                maxWidth: 480,
                borderRadius: '12px',
                height: 40,
                px: 3,
                fontSize: 14,
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              New Project
            </Button>
          </Box>

        </Toolbar>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "1em", height: "100%" }}>
          <Container maxWidth="lg" sx={{ py: 2, gap: "1em", display: "flex", flexDirection: "column" }}>

            {/* Title */}
            <Typography
              color='textPrimary'
              variant="h2"
              sx={{
                fontSize: isMobile ? '2rem' : '2.5rem',
                fontWeight: 'black',
                lineHeight: 1.2,
                letterSpacing: '-0.033em',
                maxWidth: 720
              }}
            >
              Projects
            </Typography>

            {/* Projetos */}
            {projects.length === 0 &&
              <Box sx={{ height: '65vh' }}>
                <Typography
                  color='textPrimary'
                  sx={{
                    fontSize: isMobile ? '1rem' : '1.5rem',
                    fontWeight: 'black',
                    lineHeight: 1.2,
                    letterSpacing: '-0.033em',
                    maxWidth: 720
                  }}
                >
                  You do not have any projects yet, create one by clicking on 'New Project'.
                </Typography>
              </Box>
            }

            <Grid container spacing={2}>

              {projects.map((project, idx) => {
                return <Grid
                  key={idx}
                  size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
                  <ProjectItem
                    isMobile={isMobile}
                    title={project.name}
                    description={project.description ?? ""}
                    onClick={() => { navigate(`/app/project/${project.id}`) }}
                    onDelete={() => setProjectToRemove(project.id)}
                    onEdit={() => setEditProject({
                      id: project.id,
                      name: project.name,
                      description: project.description,
                    })}
                  />
                </Grid>;
              })}

            </Grid>

          </Container>

          {/* Footer */}
          <Divider />
          <Typography align='center' fontSize={12}>
            {`© ${new Date(Date.now()).getFullYear()} Paradigma. All rights reserved.`}
          </Typography>
        </Box>
      </Box >
    </>);
};

interface ProjectItemProps {
  isMobile?: boolean;
  title: string;
  description: string;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}
const ProjectItem: React.FC<ProjectItemProps> = ({
  isMobile,
  title,
  description,
  onClick,
  onDelete,
  onEdit,
}) => {

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) onDelete();
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEdit) onEdit();
  }

  return (
    <Box sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
    }}>

      <Card
        sx={{
          height: '13em',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 4 : 6,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: isMobile ? 0 : '12px',
          transition: 'transform 0.2s, box-shadow 0.2s',
          mb: "0.5em",
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 2,
          display: "flex",
          flexDirection: "row",
        }}>
          <IconButton
            aria-label="close"
            onClick={handleEdit}
            size='small'
          >
            <Edit fontSize='small' />
          </IconButton>

          <IconButton
            aria-label="close"
            onClick={handleDelete}
            size='small'
          >
            <DeleteForever fontSize='small' />
          </IconButton>
        </Box>

        <CardActionArea onClick={onClick} sx={{ height: '100%', width: "100%" }}>
          <ParticleGraph seed={title} style={{ height: '100%', width: '100%' }} />
        </CardActionArea>
      </Card>

      <Typography fontWeight={'bold'} fontSize={16} textAlign={'justify'}>
        {title}
      </Typography>

      <Typography fontSize={14} textAlign={'justify'}>
        {description}
      </Typography>

    </Box>);
}