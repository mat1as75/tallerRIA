import { OrderProduct } from "./OrderProduct.interface"
import { ShippingInfo } from "./ShippingInfo.interface"

export interface Order {
    ID: number
    ID_Cliente: number
    Nombre_Cliente: string
    Total: number
    Estado: string
    datosEnvio: ShippingInfo
    productos: OrderProduct[]
}