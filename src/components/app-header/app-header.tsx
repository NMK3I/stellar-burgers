import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector((state) => state.auth.user);

  return <AppHeaderUI userName={userName?.name} />;
};
