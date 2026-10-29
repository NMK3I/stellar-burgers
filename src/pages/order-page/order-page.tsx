import { OrderInfo } from '@components';
import { useParams } from 'react-router-dom';

import styles from '../../components/app/app.module.css';

export const OrderPage = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  return (
    <main className={styles.detailPageWrap}>
      <h3 className={`text text_type_digits-default mb-10 ${styles.detailHeader}`}>
        #{number}
      </h3>
      <div>
        <OrderInfo />
      </div>
    </main>
  );
};
