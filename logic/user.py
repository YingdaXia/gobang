__author__ = 'Administrator'

STATUS_ONLINE = 10000       # ����״̬
STATUS_LEAVE = 10001        # �뿪״̬
STATUS_OFFLINE = 10002      # ����״̬


class User:
    id = ""                     # �û���
    name = ""                   # �ǳ�
    password = ""               # ����
    score = 0                   # ���ݻ���
    total_games = 0             # �ܾ���
    win_games = 0               # ʤ��
    tie_games = 0               # ƽ��
    lose_games = 0              # ����
    head_id = 0                 # ͷ��id
    status = STATUS_OFFLINE     # ����״̬

    # ��ʼ��
    def __init__(self):
        pass

    # �����û���
    def set_id(self):
        pass

    # ����/�޸��ǳ�
    def set_name(self):
        pass

    # ����/�޸�����
    def set_password(self):
        pass

    # ���ͺ�������
    def send_friendrequest(self):
        pass

    # ��ȡ�����б�
    def get_friendlist(self):
        pass

    # ��ȡ��Ϸ��ʷ��¼
    def get_history(self):
        pass


