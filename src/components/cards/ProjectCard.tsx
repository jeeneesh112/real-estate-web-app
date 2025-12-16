import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';

interface ProjectCardProps {
  title: string;
  description?: string;
  image?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, image }) => {
  return (
    <Card>
      {image && (
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small">View Details</Button>
      </CardActions>
    </Card>
  );
};
