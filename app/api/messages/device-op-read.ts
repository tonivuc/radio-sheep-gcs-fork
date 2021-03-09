import {MAVLinkMessage} from '@gardsteinsvik/node-mavlink';
import {readInt64LE, readUInt64LE} from '@gardsteinsvik/node-mavlink';
import {DeviceOpBustype} from '../enums/device-op-bustype';
/*
Read registers for a device.
*/
// target_system System ID. uint8_t
// target_component Component ID. uint8_t
// request_id Request ID - copied to reply. uint32_t
// bustype The bus type. uint8_t
// bus Bus number. uint8_t
// address Bus address. uint8_t
// busname Name of device on bus (for SPI). char
// regstart First register to read. uint8_t
// count Count of registers to read. uint8_t
// bank Bank number. uint8_t
export class DeviceOpRead extends MAVLinkMessage {
	public target_system!: number;
	public target_component!: number;
	public request_id!: number;
	public bustype!: DeviceOpBustype;
	public bus!: number;
	public address!: number;
	public busname!: string;
	public regstart!: number;
	public count!: number;
	public bank!: number;
	public _message_id: number = 11000;
	public _message_name: string = 'DEVICE_OP_READ';
	public _crc_extra: number = 134;
	public _message_fields: [string, string, boolean, number][] = [
		['request_id', 'uint32_t', false, 0],
		['target_system', 'uint8_t', false, 0],
		['target_component', 'uint8_t', false, 0],
		['bustype', 'uint8_t', false, 0],
		['bus', 'uint8_t', false, 0],
		['address', 'uint8_t', false, 0],
		['busname', 'char', false, 40],
		['regstart', 'uint8_t', false, 0],
		['count', 'uint8_t', false, 0],
		['bank', 'uint8_t', true, 0],
	];
}
