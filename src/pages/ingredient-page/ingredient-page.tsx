import { IngredientDetails } from '@/components';

import styles from '../../components/app/app.module.css';

export const IngredientPage = (): React.JSX.Element => (
  <main className={styles.detailPageWrap}>
    <h1 className={`text text_type_main-large ${styles.detailHeader}`}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </main>
);
