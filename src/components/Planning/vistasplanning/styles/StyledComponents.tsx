import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  Chip,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import Button from '../../../Common/Button';

export const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '8px',
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
  },
  '& .MuiAccordion-root': {
    background: 'transparent',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      margin: 0,
    }
  }
}));

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '16px',
  margin: theme.spacing(1.5, 0),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  },
  '&.Mui-expanded': {
    backgroundColor: theme.palette.primary.main,
  }
}));

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3),
  background: '#ffffff',
  borderRadius: '16px',
  boxShadow: 'inset 0 2px 12px rgba(0, 0, 0, 0.03)',
  margin: theme.spacing(0, 1),
}));

export const StyledExerciseBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: '#ffffff',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid',
  borderColor: theme.palette.primary.main,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    borderColor: theme.palette.primary.main,
    '&::after': {
      opacity: 1,
    }
  }
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  padding: theme.spacing(0.5),
  height: '28px',
  background: theme.palette.primary.main,
  border: 'none',
  '& .MuiChip-label': {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
  '&.secondary': {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    '& .MuiChip-icon': {
      color: theme.palette.secondary.main,
    }
  }
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  '&.error': {
    background: theme.palette.error.main,
    color: theme.palette.error.main,
    '&:hover': {
      background: theme.palette.error.main,
    }
  }
}));

export const ExerciseCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));