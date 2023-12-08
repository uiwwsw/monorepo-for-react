import { Alarm } from '!/socket/domain';

export const convertAlarmToMessage = ({ alarmCode, carrierId, reason, location }: Alarm<TITAN_INTERNAL_EVENT_ID>) => {
  switch (alarmCode) {
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_MASTER_CONF_INVALID:
      return `Invalid mater configuration zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_SLAVE_CONF_INVALID:
      return `Invalid slave configuration zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_SLAVE_CONNECTION_ERROR:
      return `Slave connection error zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_MOTOR_ERROR: {
      if (reason === TITAN_INTERNAL_EVENT_ID.ERROR_EX_SAFE_LOCK_SUB_01) {
        return `Motor Error Safe lock activated zone[${location}] reason[${reason}]`;
      } else {
        return `Motor Error zone[${location}] reason[${reason}]`;
      }
    }
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_COMMUNICATION_ERROR:
      return `Communication Error zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_TURN_HOME_FAILED:
      return `Turn home failed in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_TURN_FAILED:
      return `Turn failed in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_LIFT_HOME_FAILED:
      return `Lift home failed in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_LIFT_FAILED:
      return `Lift failed in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_MOTION_CARRIER_STUCK:
      return `Carrier ${carrierId} stuck in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_CARRIER_FOUND:
      return `Carrier found in a not allowed zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_E84_IO_FAILED:
      return `Carrier handoff E84 Failed in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_E84_TP1_TIMEOUT:
      return `Carrier handoff E84 TP1 timeout, TR_REQ did not turn ON in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_E84_TP2_TIMEOUT:
      return `Carrier handoff E84 TP2 timeout, BUSY did not turn ON in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_E84_TP3_TIMEOUT:
      return `Carrier handoff E84 TP3 timeout, Carrier was not installed/removed inside E84 in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_E84_TP4_TIMEOUT:
      return `Carrier handoff E84 TP4 timeout in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_E84_TP5_TIMEOUT:
      return `Carrier handoff E84 TP5 timeout in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_MANUAL_PORT_SENSOR_ERROR:
      return `Manual port sensor error in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_CARRIER_LOST:
      return `Carrier lost in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_CARRIER_EXIT_ZONE_FAILED:
      return `Carrier exit error in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_CARRIER_ENTER_ZONE_FAILED:
      return `Carrier enter error in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_SYNC_LIFT_LEAD_FAILED:
      return `Sync lifting lead error in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_SYNC_LIFT_FOLLOW_FAILED:
      return `Sync lifting follow error in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_EMERGENCY: {
      if (reason === '1') {
        return `ALARM TCM EMERGENCY zone[${location}] reason[${reason}] ALARM_REASON_FIREWALL_SIGNAL_ACTIVATED`;
      } else {
        return `ALARM TCM EMERGENCY zone[${location}] reason[${reason}]`;
      }
    }
    case TITAN_INTERNAL_EVENT_ID.ALARM_TCM_INIT_FAILED:
      return `Initialize failed(check h/w, e84, etc, ...) in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_SYSTEM_FAIL_OVERED:
      return `System Fail-overed reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_ABNORMAL_TCM_DISCONNECTED:
      return `terminate abnormally in tcm ${location}  reason[${reason}]`;

    case TITAN_INTERNAL_EVENT_ID.ALARM_TSC_NO_ROUTE:
      return `Can not find path in zone[${location}] reason[${reason}]`;
    case TITAN_INTERNAL_EVENT_ID.ALARM_TSC_AIR_SHOWER_NOT_AVAILABLE:
      return `Air-shower is not available. Please check. Reason[${reason}]`;

    case TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_TCM:
      return `TCM ${location}이 시작되었습니다.`;
    case TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_TCM:
      return `TCM ${location}이 멈췄습니다.`;
    case TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_DCM:
      return `DCM이 시작되었습니다.`;
    case TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_DCM:
      return `DCM이 멈췄습니다.`;
    case TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_HIM:
      return `HIM이 시작되었습니다.`;
    case TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_HIM:
      return `HIM이 멈췄습니다.`;

    default:
      return `정의되지 않은 알람코드입니다 ${alarmCode}`;
  }
};

export const enum TITAN_INTERNAL_EVENT_ID {
  ALARM_MOTION_MASTER_CONF_INVALID = '11010',
  ALARM_MOTION_SLAVE_CONF_INVALID = '11020',
  ALARM_MOTION_SLAVE_CONNECTION_ERROR = '11030',
  /** Motor Error in Zone No - Zone에서 Motor 물리적 Error 발생. */
  ALARM_MOTION_MOTOR_ERROR = '11040',
  ALARM_MOTION_COMMUNICATION_ERROR = '11050',
  ALARM_MOTION_TURN_HOME_FAILED = '11200',
  ALARM_MOTION_TURN_FAILED = '11210',
  ALARM_MOTION_LIFT_HOME_FAILED = '11220',
  ALARM_MOTION_LIFT_FAILED = '11230',
  /** Carrier can't move. */
  ALARM_MOTION_CARRIER_STUCK = '11240',

  /** Carrier found in a not allowed Zone - 현재 이송중인 Carrier가 없는 Zone에서 Carrier가 감지된 경우 발생. */
  ALARM_TCM_CARRIER_FOUND = '12100',
  /** Detect an error during E84 Handoff Sequence - Input Port, Output Port에서 E84 통신으로 Carrier Loading/Unloading 할 때 Alarm이 발생. */
  ALARM_TCM_E84_IO_FAILED = '12200',
  /** TP1 Timeout - E84 TR_REQ On신호 감지 실패. */
  ALARM_TCM_E84_TP1_TIMEOUT = '12210',
  /** TP2 Timeout - E84 TR_BUSY On 신호 감지 실패. */
  ALARM_TCM_E84_TP2_TIMEOUT = '12220',
  /** TP3 Timeout - Carrier가 Install 또는 Remove 되지 않음. */
  ALARM_TCM_E84_TP3_TIMEOUT = '12230',
  /** TP4 Timeout - BUSY Off, TR_REQ Off , COMPT On 신호 감지 실패. */
  ALARM_TCM_E84_TP4_TIMEOUT = '12240',
  /** TP5 Timeout - VALID Off, CS_0 Off, COMPT Off 신호 감지 실패. */
  ALARM_TCM_E84_TP5_TIMEOUT = '12250',
  ALARM_TCM_MANUAL_PORT_SENSOR_ERROR = '12260',
  /** Carrier Lost in Zone No - 정지 중인 Carrier가 비정상적으로 제거됨. */
  ALARM_TCM_CARRIER_LOST = '12400',
  /** S2 didn't turn off..Carrier failed to exit from a zone - Carrier가 Zone1에서 Zone2으로 Handoff 할 때 Zone2에서 Sensor1이 On되고 일정 시간 이내에 Zone1의 Sensor2가 Off 되지 않을 때 발생. */
  ALARM_TCM_CARRIER_EXIT_ZONE_FAILED = '12410',
  /** S2 didn't turn on..Carrier failed to enter into a zone - Carrier가 Zone1에서 Zone2로 Handoff 할 때 Zone1에서 Sensor2가 Off 되고 일정 시간 이내에 Zone2의 Sensor1가 On 되지 않았을 때 발생. */
  ALARM_TCM_CARRIER_ENTER_ZONE_FAILED = '12420',
  ALARM_TCM_SYNC_LIFT_LEAD_FAILED = '12430',
  ALARM_TCM_SYNC_LIFT_FOLLOW_FAILED = '12440',
  ALARM_TCM_EMERGENCY = '12450', //ALARM_REASON_UNKNOWN = -1, ALARM_REASON_NONE = 0, ALARM_REASON_FIREWALL_SIGNAL_ACTIVATED = 1,
  ALARM_ABNORMAL_TCM_DISCONNECTED = '12500',
  ALARM_SYSTEM_FAIL_OVERED = '12510',
  ALARM_TCM_INIT_FAILED = '12900',

  /** Can not find Path in Zone - 이송할 경로를 찾지 못했을 때 발생. */
  ALARM_TSC_NO_ROUTE = '19010',
  /** Air shower가 valid count 이하로 동작할 경우 발생 */
  ALARM_TSC_AIR_SHOWER_NOT_AVAILABLE = '19020',

  ERROR_EX_SAFE_LOCK_SUB_01 = '21001', // ALARM_MOTION_MOTOR_ERROR = 11040, reason

  EVENT_CARRIER_DETECTED = '22200',
  EVENT_E84_SUCCEED = '22210',
  EVENT_READ_RFID_FAILED = '22220',
  EVENT_READ_RFID = '22230',
  /** HIM에서 발생. */
  EVENT_CARRIER_INSTALLED = '22240',
  EVENT_CARRIER_ARRIVED = '22250',
  /** HIM에서 발생(output RFID read 완료 후 문제 없으면). */
  EVENT_TRANSFER_COMPLETED = '22260',
  EVENT_CARRIER_REMOVED = '22270',
  EVENT_CARRIER_ID_DUPLICATED = '22280',
  EVENT_CARRIER_STORE_COMPLETED = '22290',
  /** DCM에서 발생. */
  EVENT_TRANSFER_INITIATED = '22410',
  EVENT_TRANSFER_TRANSFERRING = '22420',
  /** TCM에서 발생(TSC와 관련 없음). */
  EVENT_TRANSFER_PAUSED = '22430',
  /** TCM에서 발생(TSC와 관련 없음). */
  EVENT_TRANSFER_ABORTED = '22440',
  /** TCM에서 발생(TSC와 관련 없음). */
  EVENT_TRANSFER_RESUMED = '22450',

  EVENT_CONNECTED_TCM = '24010',
  EVENT_DISCONNECTED_TCM = '24020',
  EVENT_CONNECTED_DCM = '24030',
  EVENT_DISCONNECTED_DCM = '24040',
  EVENT_CONNECTED_HIM = '24050',
  EVENT_DISCONNECTED_HIM = '24060',

  EVENT_TSC_INITIATED = '29010',
  EVENT_TSC_AUTO_COMPLETED = '29020',
  EVENT_TSC_PAUSED = '29030',
  EVENT_TSC_PAUSING = '29040',

  EVENT_TSC_CONTROL_ONLINE = '29050',
  EVENT_TSC_CONTROL_OFFLINE = '29060',

  EVENT_TSC_ERR_NONE = '29070',
  EVENT_TSC_ERR_ALARM = '29080',
}
export const MODULE_STATE_CHANGE_MSGS = [
  // TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_TCM,
  // TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_TCM,
  TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_DCM,
  TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_DCM,
  TITAN_INTERNAL_EVENT_ID.EVENT_CONNECTED_HIM,
  TITAN_INTERNAL_EVENT_ID.EVENT_DISCONNECTED_HIM,
];
