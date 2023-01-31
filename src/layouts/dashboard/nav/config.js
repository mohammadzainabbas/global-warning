// component
import SvgColor from '../../../components/svg-color';
import { HOME, GITHUB_REPO_LINK, TASKS, MAP } from '../../../common/constants';
import HomeIcon from '@mui/icons-material/Home';
import GitHubIcon from '@mui/icons-material/GitHub';
import TaskIcon from '@mui/icons-material/Task';
import MapIcon from '@mui/icons-material/Map';
// ----------------------------------------------------------------------

// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Home',
    path: HOME,
    icon: <HomeIcon />,
  },
  {
    title: 'Map',
    path: `${HOME}/${MAP}`,
    icon: <MapIcon />,
  },
  {
    title: 'Tasks',
    path: `${HOME}/${TASKS}`,
    icon: <TaskIcon />,
  },
  {
    title: 'View on Github',
    path: GITHUB_REPO_LINK,
    icon: <GitHubIcon />,
  },
];

export default navConfig;
