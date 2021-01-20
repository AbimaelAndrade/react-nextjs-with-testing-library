import { render, screen, waitFor, fireEvent} from '@testing-library/react'
import ProductList from '../pages'
import {makeServer} from '../miragejs/server'
import useEvent from '@testing-library/user-event'

const renderProductList = () => {
  render(<ProductList />);
}
 
describe('<ProductList />', () => {
  let server;
  beforeEach(() => {
    server = makeServer({environment: 'test'})
  })

  afterEach(() => {
    server.shutdown()
  })

  it('Should render ProductList', () => {
    renderProductList();

    expect(screen.getByTestId('product-list')).toBeInTheDocument()
  })

  it('should render the ProductList component 10 times', async () => {
    server.createList('product', 10)
    renderProductList();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(10);
    })
  })

  it('should render the "no products messages"', async () => {
    server.createList('product', 0)

    renderProductList()

    await waitFor(() => {
      expect(screen.getByTestId('no-products-message')).toBeInTheDocument();
    });
  });

  it('should display error message when promise rejects', async () => {
    server.get('products', () => {
      return Response(500, {}, '');
    });

    renderProductList();

    await waitFor(() => {
      expect(screen.getByTestId('server-message-error')).toBeInTheDocument();
      expect(screen.queryByTestId('no-products-message')).toBeNull();
      expect(screen.queryAllByTestId('product-card')).toHaveLength(0)
    }) 
  });

  it('should filter the product list when a search is performed', async () => {
    const searchTerm = 'Relógio Automático';
    server.createList('product', 2);
    server.create('product', {
      title: searchTerm
    });

    renderProductList();

    await waitFor(()=> {
      expect(screen.getAllByTestId('product-card')).toHaveLength(3);
    });

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await useEvent.type(input, searchTerm);
    await fireEvent.submit(form);

    await waitFor(()=> {
      expect(screen.getAllByTestId('product-card')).toHaveLength(1);
    });
  });

  it.todo('should display the total quantity of products')
  it.todo('should display product (singular) when there is only 1 product')

})