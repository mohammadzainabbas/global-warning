// component
import SvgColor from '../../../components/svg-color';
import { HOME, GITHUB_REPO_LINK } from '../../../common/constants';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Home',
    path: HOME,
    icon: icon('ic_analytics'),
  },
  {
    title: 'View on Github',
    path: GITHUB_REPO_LINK,
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
