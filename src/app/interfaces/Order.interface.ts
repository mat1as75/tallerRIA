import { OrderProduct } from "./OrderProduct.interface"
import { ShippingInfo } from "./ShippingInfo.interface"

export interface Order {
    ID_Cliente: number
    Total: number
    Estado: string
    datosEnvio: ShippingInfo
    productos: OrderProduct[]
}