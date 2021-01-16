import { fireEvent, render, screen} from '@testing-library/react'
import ProductCard from './product-card'

const productMock = {
  title: 'Relógio automático',
  price: 'R$ 899,00',
  image: 'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'
}

const addToCart = jest.fn()

const renderProductCard = () => {
  render(<ProductCard product={productMock} addToCart={addToCart} />)
}
 
describe('<ProductCard />', () => {
  it('Should render ProductCard', () => {
    renderProductCard()
 
    expect(screen.getByTestId('product-card')).toBeInTheDocument()
  })

  it('Should display props in the document', () =>{
    renderProductCard()

    expect(screen.getByText(productMock.title)).toBeInTheDocument()
    expect(screen.getByText(productMock.price)).toBeInTheDocument()
    expect(screen.getByTestId('image')).toHaveStyle({
      backgroundImage: productMock.image
    })
  })

  it('Should call props.addToCart when button gets clicked', async () => {
    renderProductCard()
    const button = screen.getByRole('button')
    await fireEvent.click(button)

    expect(addToCart).toHaveBeenCalledTimes(1)
    expect(addToCart).toHaveBeenCalledWith(productMock)

  })
})