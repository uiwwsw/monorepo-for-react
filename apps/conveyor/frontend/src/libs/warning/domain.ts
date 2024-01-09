import { StatsWarningData } from '!/stats/domain';
import { t } from 'src/i18n';
export const convertWarningToMessage = ({
  warningCode,
  location,
  carrierId,
  reason,
  taskId,
}: Partial<StatsWarningData['rows'][number]>) => {
  switch (warningCode) {
    case WARNING_CODE.EVENT_CARRIER_DETECTED:
      return t(`구역 {{location}}에서 운송 수단 감지됨, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_E84_SUCCEED:
      return t(`구역 {{location}}에서 E84 통신 성공, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.WARNING_LV1_READ_RFID_FAILED:
    case WARNING_CODE.EVENT_READ_RFID_FAILED:
      return t(`구역 {{location}}에서 RFID 읽기 실패, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_READ_RFID:
      return t(`구역 {{location}}에서 RFID 읽기, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_CARRIER_INSTALLED:
      return t(`운송 수단 {{carrierId}} 구역 {{location}}에 설치됨, 원인[{{reason}}]`, { carrierId, location, reason });
    case WARNING_CODE.EVENT_CARRIER_ARRIVED:
      return t(`운송 수단 {{carrierId}} 구역 {{location}}에 도착함, 원인[{{reason}}]`, { carrierId, location, reason });
    case WARNING_CODE.EVENT_TRANSFER_COMPLETED:
      return t(`구역 {{location}}에서 이송 완료, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_CARRIER_ID_DUPLICATED:
      return t(`구역 {{location}}에서 운송 수단 ID 중복, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_CARRIER_STORE_COMPLETED:
      return t(`운송 수단 {{carrierId}} 저장 완료, 원인[{{reason}}]`, { carrierId, reason });
    case WARNING_CODE.EVENT_CARRIER_REMOVED:
      return t(`운송 수단 {{carrierId}} 구역 {{location}}에서 제거됨, 원인[{{reason}}]`, {
        carrierId,
        location,
        reason,
      });
    case WARNING_CODE.EVENT_TRANSFER_INITIATED:
      return t(`구역 {{location}}에서 이송 시작됨, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_TRANSFER_TRANSFERRING:
      return t(`구역 {{location}}에서 이송 중, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_TRANSFER_PAUSED:
      return t(`구역 {{location}}에서 이송 일시 중단됨, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_TRANSFER_ABORTED:
      return t(`구역 {{location}}에서 이송 중단됨, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_TRANSFER_RESUMED:
      return t(`구역 {{location}}에서 이송 재개됨, 원인[{{reason}}]`, { location, reason });

    case WARNING_CODE.EVENT_CONNECTED_TCM:
      return t(`TCM {{location}} 연결됨, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.WARNING_LV1_DISCONNECTED_TCM:
    case WARNING_CODE.EVENT_DISCONNECTED_TCM:
      return t(`TCM {{location}} 연결 해제됨, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.EVENT_CONNECTED_DCM:
      return t(`DCM 연결됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.WARNING_LV1_DISCONNECTED_DCM:
    case WARNING_CODE.EVENT_DISCONNECTED_DCM:
      return t(`DCM 연결 해제됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.EVENT_CONNECTED_HIM:
      return t(`HIM 연결됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.WARNING_LV1_DISCONNECTED_HIM:
    case WARNING_CODE.EVENT_DISCONNECTED_HIM:
      return t(`HIM 연결 해제됨, 원인[{{reason}}]`, { reason });

    case WARNING_CODE.EVENT_TSC_INITIATED:
      return t(`장비 시작됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.EVENT_TSC_AUTO_COMPLETED:
      return t(`장비 자동 설정 완료, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.EVENT_TSC_PAUSED:
      return t(`장비 일시 중단됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.EVENT_TSC_PAUSING:
      return t(`장비 중단 중, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.WARNING_LV1_MOTOR_NOT_READY:
      return t(`TCM{{location}} 모터 준비 안 됨, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.WARNING_LV1_LIFTER_DOOR_OPENED:
      return t(`리프터 {{location}} 문 열림, 원인[{{reason}}]`, { location, reason });
    case WARNING_CODE.WARNING_LV1_FIRE_EMERGENCY_ACTIVATED:
      return t(`화재 비상사태 발동됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.WARNING_LV1_FIRE_EMERGENCY_RELEASED:
      return t(`화재 비상사태 해제됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.WARNING_LV1_FIRE_DOOR_OPERATION_STARTED:
      return t(`화재 문 작동 시작됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.WARNING_LV1_FIRE_DOOR_OPERATION_COMPLETED:
      return t(`화재 문 작동 완료됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.WARNING_LV1_SMOKE_DETECT_ACTIVATED:
      return t(`연기 감지기 작동됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.WARNING_LV1_SMOKE_DETECT_RELEASED:
      return t(`연기 감지기 해제됨, 원인[{{reason}}]`, { reason });

    case WARNING_CODE.WARNING_LV1_USER_STOP_ACTIVATED:
      return t(`사용자 정지 작동됨, 원인[{{reason}}]`, { reason });
    case WARNING_CODE.WARNING_LV1_SBM_DISCONNECTED:
      return t(`SBM 연결 해제됨`);
    case WARNING_CODE.WARNING_LV1_CARRIER_STAYS_TOO_LONG:
      return t(`운송 수단 지연, 구역[{{location}}] 작업 ID[{{taskId}}]`, { taskId, location });
    case WARNING_CODE.WARNING_LV2_RETRY_OCCURRED:
      return t(`구역 {{location}}에서 재시도 발생, 원인[{{reason}}]`, { reason, location });
    case WARNING_CODE.WARNING_LV2_DISCONNECTED_MOTION:
      return t(`동작 연결 해제됨, 원인[{{reason}}]`, { reason });
    default:
      return t(`알 수 없는 이벤트({{warningCode}}), 원인[{{reason}}]`, { warningCode, reason });
  }
};

export const enum WARNING_CODE {
  ALARM_MOTION_MASTER_CONF_INVALID = '11010',
  ALARM_MOTION_SLVAE_CONF_INVALID = '11020',
  ALARM_MOTION_SLVAE_CONNECTION_ERROR = '11030',
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
  ALARM_SYSTEM_FAILOVERED = '12510',
  ALARM_TCM_INIT_FAILED = '12900',

  /** TCM에서 발생하는 것이아닌 임의의 알람목록  */
  ALARM_TOO_OFTEN_RETRY = '14010', //한 Zone에서 1시간 안에 Retry가 정해진 기준 이상 발생한 경우 발생
  ALARM_RESOURCE_USAGE_IS_TOO_HIGH = '14020', // Resource usage가 limit 이상 넘어간 경우 발생

  /** Can not find Path in Zone - 이송할 경로를 찾지 못했을 때 발생. */
  ALARM_TSC_NO_ROUTE = '19010',

  /** Reason */
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

  WARNING_LV1_DISCONNECTED_TCM = '31110',
  WARNING_LV1_DISCONNECTED_DCM = '31120',
  WARNING_LV1_DISCONNECTED_HIM = '31130',
  // WARNING_LV1_SYSTEM_FAILOVERED = '31140',
  WARNING_LV1_MOTOR_NOT_READY = '31150',

  WARNING_LV1_READ_RFID_FAILED = '31210',
  WARNING_LV1_LIFTER_DOOR_OPENED = '31220',
  WARNING_LV1_FIRE_EMERGENCY_ACTIVATED = '31230',
  WARNING_LV1_FIRE_EMERGENCY_RELEASED = '31240',
  WARNING_LV1_FIRE_DOOR_OPERATION_STARTED = '31250',
  WARNING_LV1_FIRE_DOOR_OPERATION_COMPLETED = '31260',
  WARNING_LV1_SMOKE_DETECT_ACTIVATED = '31270',
  WARNING_LV1_SMOKE_DETECT_RELEASED = '31280',
  WARNING_LV1_USER_STOP_ACTIVATED = '31290',
  WARNING_LV1_SBM_DISCONNECTED = '31300',
  WARNING_LV1_CARRIER_STAYS_TOO_LONG = '31310',

  WARNING_LV2_RETRY_OCCURRED = '32110',
  WARNING_LV2_DISCONNECTED_MOTION = '32120',
}
