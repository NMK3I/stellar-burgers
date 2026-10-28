import { OrderInfo } from '@components';
import { useParams } from 'react-router-dom';

export const OrderPage = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '122px',
      }}
    >
      <h3 className="text text_type_digits-default">#{number}</h3>
      <div>
        <OrderInfo />
      </div>
    </main>
  );
};
