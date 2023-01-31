// component
import SvgColor from '../../../components/svg-color';
import { HOME, GITHUB_REPO_LINK, TASKS, MAP } from '../../../common/constants';
import HomeIcon from '@mui/icons-material/Home';
import GitHubIcon from '@mui/icons-material/GitHub';
import TaskIcon from '@mui/icons-material/Task';

// ----------------------------------------------------------------------

// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Home',
    path: HOME,
    icon: <HomeIcon />,
  },
  {
    title: 'Tasks',
    path: `${HOME}/${TASKS}`,
    icon: <TaskIcon />,
  },
  {
    title: 'Map',
    path: `${HOME}/${MAP}`,
    icon: <TaskIcon />,
  },
  {
    title: 'View on Github',
    path: GITHUB_REPO_LINK,
    icon: <GitHubIcon />,
  },
];

export default navConfig;
