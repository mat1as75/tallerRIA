export interface OrderConfirmation {
    Email: string
    Nombre: string
    ID_Pedido: number
    Total: number
    MetodoPago: string
    FechaPedido: string
    productos: {
        Nombre: string
        Cantidad: number
        Precio: number
    }[]
}