import { IngredientDetails } from '@/components';

export const IngredientPage = (): React.JSX.Element => (
  <main
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '80px',
    }}
  >
    <h1 className="text text_type_main-large">Детали ингредиента</h1>
    <IngredientDetails />
  </main>
);
