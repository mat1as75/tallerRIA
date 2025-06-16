import { ShippingInfo } from "./ShippingInfo.interface"

export interface Order {
    ID_Cliente: number
    Total: number
    Estado: string
    datosEnvio: ShippingInfo
    productos: [
        {
            ID_Producto: number
            Cantidad: number
            Precio: number
        }
    ]
}