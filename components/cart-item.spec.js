import { fireEvent, render, screen} from '@testing-library/react'
import CartItem from './cart-item'

const productMock = {
  title: 'Relógio automático',
  price: 'R$ 899,00',
  image: 'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'
}

const addToCart = jest.fn()

const renderCartItem = () => {
  render(<CartItem product={productMock} />)
}
 
describe('<CartItem />', () => {
  it('Should render CartItem', () => {
    renderCartItem()
 
    expect(screen.getByTestId('cart-item')).toBeInTheDocument()
  })

  it('Should display props in the document', () =>{
    renderCartItem()

    const image = screen.getByTestId('image')

    expect(screen.getByText(productMock.title)).toBeInTheDocument()
    expect(screen.getByText(productMock.price)).toBeInTheDocument()
    expect(image).toHaveProperty('src', productMock.image)
    expect(image).toHaveProperty('alt', productMock.title)
  })

  it('Should display 1 as initial quantity', () => {
    renderCartItem()

    expect(screen.getByTestId('quantity').textContent).toBe("1")
  })

  it('Should increase quantity by 1 when second button is clicked', async () => {
    renderCartItem()

    const [_, button] = screen.getAllByRole('button')

    await fireEvent.click(button)
  
    expect(screen.getByTestId('quantity').textContent).toBe("2")
  })

  it('Should decrease quantity by 1 when first button is clicked', async () => {
    renderCartItem()

    const [buttonDecrease, buttonIncrease] = screen.getAllByRole('button')
    const quantity = screen.getByTestId('quantity')

    await fireEvent.click(buttonIncrease)
    expect(quantity.textContent).toBe("2")

    await fireEvent.click(buttonDecrease)
    expect(quantity.textContent).toBe("1")
  })

  fit('Should not go below zero in the quantity', async () => {
    renderCartItem()

    const [buttonDecrease, _] = screen.getAllByRole('button')
    const quantity = screen.getByTestId('quantity')

    await fireEvent.click(buttonDecrease)
    await fireEvent.click(buttonDecrease)

    expect(quantity.textContent).toBe("0")
  })
})