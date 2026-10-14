-- AkibaFlow schema v1. All money is BIGINT minor units (KES cents). Dates in due_date columns are
-- group-local calendar dates; DATETIME columns are UTC.
-- Statements are separated by a line containing only ";;" (so trigger bodies stay intact).

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(20) NULL,
  full_name VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active','suspended') NOT NULL DEFAULT 'active',
  is_super_admin TINYINT(1) NOT NULL DEFAULT 0,
  email_verified_at DATETIME NULL,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE user_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  type ENUM('email_verify','password_reset') NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_token (token_hash),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE user_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  session_hash CHAR(64) NOT NULL,
  ip VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  created_at DATETIME NOT NULL,
  last_seen_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  UNIQUE KEY uq_session (session_hash),
  KEY idx_sess_user (user_id, revoked_at),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE auth_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  identifier VARCHAR(190) NULL,
  ip VARCHAR(45) NULL,
  event ENUM('login_ok','login_fail','logout','register','reset_request','password_changed') NOT NULL,
  created_at DATETIME NOT NULL,
  KEY idx_ae_ident (identifier, event, created_at),
  KEY idx_ae_ip (ip, event, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE notification_preferences (
  user_id BIGINT UNSIGNED NOT NULL,
  channel ENUM('email','sms') NOT NULL,
  category ENUM('reminders','announcements') NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, channel, category),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE `groups` (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  purpose VARCHAR(190) NULL,
  country CHAR(2) NOT NULL DEFAULT 'KE',
  currency CHAR(3) NOT NULL DEFAULT 'KES',
  timezone VARCHAR(64) NOT NULL DEFAULT 'Africa/Nairobi',
  contact_email VARCHAR(190) NULL,
  contact_phone VARCHAR(20) NULL,
  membership_mode ENUM('invite_only','request_to_join') NOT NULL DEFAULT 'invite_only',
  status ENUM('active','archived','closed','suspended') NOT NULL DEFAULT 'active',
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_group_code (code),
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE group_settings (
  group_id BIGINT UNSIGNED PRIMARY KEY,
  allocation_policy ENUM('oldest_first') NOT NULL DEFAULT 'oldest_first',
  excess_policy ENUM('hold_credit','apply_future') NOT NULL DEFAULT 'hold_credit',
  allow_partial TINYINT(1) NOT NULL DEFAULT 1,
  allow_advance TINYINT(1) NOT NULL DEFAULT 1,
  penalty_enabled TINYINT(1) NOT NULL DEFAULT 0,
  penalty_fixed_minor BIGINT NOT NULL DEFAULT 0,
  penalty_after_days SMALLINT NOT NULL DEFAULT 0,
  penalty_max_per_member_minor BIGINT NOT NULL DEFAULT 0,
  remind_before_days SMALLINT NOT NULL DEFAULT 0,
  reminders_paused TINYINT(1) NOT NULL DEFAULT 0,
  reminder_channels VARCHAR(40) NOT NULL DEFAULT 'in_app,email',
  overdue_digest TINYINT(1) NOT NULL DEFAULT 1,
  expense_dual_threshold_minor BIGINT NOT NULL DEFAULT 0,
  dual_control_reversals TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (group_id) REFERENCES `groups`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE group_memberships (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  member_code VARCHAR(12) NOT NULL,
  role ENUM('chairperson','treasurer','secretary','member','auditor') NOT NULL DEFAULT 'member',
  status ENUM('pending','active','suspended','exited','rejected') NOT NULL DEFAULT 'pending',
  joined_on DATE NULL,
  exited_on DATE NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_member (group_id, user_id),
  UNIQUE KEY uq_member_code (member_code),
  KEY idx_gm_user (user_id, status),
  FOREIGN KEY (group_id) REFERENCES `groups`(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE group_invitations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  email VARCHAR(190) NOT NULL,
  role ENUM('chairperson','treasurer','secretary','member','auditor') NOT NULL DEFAULT 'member',
  token_hash CHAR(64) NOT NULL,
  invited_by BIGINT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  accepted_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_invite_token (token_hash),
  FOREIGN KEY (group_id) REFERENCES `groups`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE contribution_plans (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  kind ENUM('recurring','one_time','special') NOT NULL DEFAULT 'recurring',
  currency CHAR(3) NOT NULL,
  status ENUM('active','paused','ended') NOT NULL DEFAULT 'active',
  mandatory TINYINT(1) NOT NULL DEFAULT 1,
  applies_to_all TINYINT(1) NOT NULL DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  KEY idx_plan_group (group_id, status),
  FOREIGN KEY (group_id) REFERENCES `groups`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE contribution_plan_versions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id BIGINT UNSIGNED NOT NULL,
  version_no INT NOT NULL,
  effective_from DATE NOT NULL,
  amount_minor BIGINT NOT NULL,
  frequency ENUM('daily','weekly','biweekly','monthly','custom_days','one_time') NOT NULL,
  weekday TINYINT NULL,            -- 1=Mon .. 7=Sun (weekly)
  month_day TINYINT NULL,          -- 1..31 ; 0 = last day of month (monthly)
  interval_days SMALLINT NULL,     -- custom_days
  anchor_date DATE NULL,           -- biweekly / custom_days phase, one_time due date
  grace_days SMALLINT NOT NULL DEFAULT 0,
  lookahead_days SMALLINT NOT NULL DEFAULT 1,
  change_reason VARCHAR(255) NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_plan_version (plan_id, version_no),
  KEY idx_pv_eff (plan_id, effective_from),
  FOREIGN KEY (plan_id) REFERENCES contribution_plans(id),
  CHECK (amount_minor > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE contribution_plan_members (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id BIGINT UNSIGNED NOT NULL,
  membership_id BIGINT UNSIGNED NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NULL,
  created_at DATETIME NOT NULL,
  KEY idx_pm (plan_id, membership_id),
  FOREIGN KEY (plan_id) REFERENCES contribution_plans(id),
  FOREIGN KEY (membership_id) REFERENCES group_memberships(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE contribution_obligations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  membership_id BIGINT UNSIGNED NOT NULL,
  plan_id BIGINT UNSIGNED NOT NULL,
  plan_version_id BIGINT UNSIGNED NOT NULL,
  kind ENUM('contribution','penalty') NOT NULL DEFAULT 'contribution',
  parent_obligation_id BIGINT UNSIGNED NULL,
  period_key VARCHAR(40) NOT NULL,
  due_date DATE NOT NULL,
  grace_days SMALLINT NOT NULL DEFAULT 0,
  original_minor BIGINT NOT NULL,
  waived_minor BIGINT NOT NULL DEFAULT 0,
  paid_minor BIGINT NOT NULL DEFAULT 0,
  status ENUM('open','paid','waived','cancelled') NOT NULL DEFAULT 'open',
  created_at DATETIME NOT NULL,
  settled_at DATETIME NULL,
  UNIQUE KEY uq_obligation (plan_id, membership_id, kind, period_key),
  KEY idx_ob_member (group_id, membership_id, status, due_date),
  KEY idx_ob_due (group_id, due_date),
  FOREIGN KEY (group_id) REFERENCES `groups`(id),
  FOREIGN KEY (membership_id) REFERENCES group_memberships(id),
  FOREIGN KEY (plan_id) REFERENCES contribution_plans(id),
  FOREIGN KEY (plan_version_id) REFERENCES contribution_plan_versions(id),
  CHECK (original_minor > 0),
  CHECK (paid_minor >= 0 AND waived_minor >= 0 AND paid_minor + waived_minor <= original_minor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE contribution_waivers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  obligation_id BIGINT UNSIGNED NOT NULL,
  amount_minor BIGINT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  actor_user_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (obligation_id) REFERENCES contribution_obligations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE contribution_reminders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  obligation_id BIGINT UNSIGNED NOT NULL,
  membership_id BIGINT UNSIGNED NOT NULL,
  type ENUM('upcoming','due_today','overdue') NOT NULL,
  outstanding_minor BIGINT NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_reminder (obligation_id, type),
  FOREIGN KEY (obligation_id) REFERENCES contribution_obligations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE payment_requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ref CHAR(20) NOT NULL,
  group_id BIGINT UNSIGNED NOT NULL,
  membership_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  plan_id BIGINT UNSIGNED NULL,
  pay_option ENUM('today','clear_all','custom','advance') NOT NULL,
  amount_minor BIGINT NOT NULL,
  method ENUM('mpesa_stk') NOT NULL DEFAULT 'mpesa_stk',
  phone VARCHAR(20) NOT NULL,
  idempotency_key VARCHAR(80) NOT NULL,
  status ENUM('created','pending','succeeded','failed','cancelled','unknown') NOT NULL DEFAULT 'created',
  provider VARCHAR(20) NOT NULL,
  provider_request_id VARCHAR(100) NULL,
  merchant_request_id VARCHAR(100) NULL,
  result_code VARCHAR(20) NULL,
  result_desc VARCHAR(255) NULL,
  provider_receipt VARCHAR(60) NULL,
  txn_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY uq_pr_ref (ref),
  UNIQUE KEY uq_pr_idem (user_id, idempotency_key),
  UNIQUE KEY uq_pr_provider (provider, provider_request_id),
  KEY idx_pr_member (membership_id, created_at),
  KEY idx_pr_status (group_id, status, created_at),
  FOREIGN KEY (group_id) REFERENCES `groups`(id),
  FOREIGN KEY (membership_id) REFERENCES group_memberships(id),
  CHECK (amount_minor > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE payment_attempts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  request_id BIGINT UNSIGNED NOT NULL,
  kind ENUM('initiate','query','callback') NOT NULL,
  ok TINYINT(1) NOT NULL,
  summary VARCHAR(500) NULL,
  created_at DATETIME NOT NULL,
  KEY idx_pa_req (request_id),
  FOREIGN KEY (request_id) REFERENCES payment_requests(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE payment_provider_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(20) NOT NULL,
  event_type ENUM('stk_callback','c2b_confirmation') NOT NULL,
  event_key VARCHAR(100) NOT NULL,
  payload MEDIUMTEXT NOT NULL,
  source_ip VARCHAR(45) NULL,
  received_at DATETIME NOT NULL,
  processed_at DATETIME NULL,
  outcome VARCHAR(60) NULL,
  request_id BIGINT UNSIGNED NULL,
  group_id BIGINT UNSIGNED NULL,
  duplicate_count INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_event (provider, event_type, event_key),
  KEY idx_ev_outcome (outcome, received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE payment_transactions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  membership_id BIGINT UNSIGNED NOT NULL,
  request_id BIGINT UNSIGNED NULL,
  provider VARCHAR(20) NOT NULL,
  provider_ref VARCHAR(60) NOT NULL,
  source ENUM('provider_verified','manual') NOT NULL,
  method VARCHAR(30) NOT NULL,
  amount_minor BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  status ENUM('posted','reversed') NOT NULL DEFAULT 'posted',
  receipt_no VARCHAR(30) NOT NULL,
  paid_at DATETIME NOT NULL,
  recorded_by BIGINT UNSIGNED NULL,
  note VARCHAR(255) NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_txn_ref (group_id, provider, provider_ref),
  UNIQUE KEY uq_receipt (receipt_no),
  KEY idx_txn_member (membership_id, paid_at),
  KEY idx_txn_group (group_id, paid_at),
  FOREIGN KEY (group_id) REFERENCES `groups`(id),
  FOREIGN KEY (membership_id) REFERENCES group_memberships(id),
  CHECK (amount_minor > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE payment_allocations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  membership_id BIGINT UNSIGNED NOT NULL,
  source ENUM('payment','credit') NOT NULL,
  txn_id BIGINT UNSIGNED NULL,
  obligation_id BIGINT UNSIGNED NULL,
  kind ENUM('obligation','credit') NOT NULL,
  amount_minor BIGINT NOT NULL,
  reversed_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  KEY idx_pal_txn (txn_id),
  KEY idx_pal_ob (obligation_id),
  KEY idx_pal_member (membership_id, source, reversed_at),
  FOREIGN KEY (txn_id) REFERENCES payment_transactions(id),
  FOREIGN KEY (obligation_id) REFERENCES contribution_obligations(id),
  CHECK (amount_minor > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE payment_reversals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  txn_id BIGINT UNSIGNED NOT NULL,
  reason VARCHAR(255) NOT NULL,
  requested_by BIGINT UNSIGNED NOT NULL,
  approved_by BIGINT UNSIGNED NULL,
  status ENUM('requested','approved','rejected') NOT NULL DEFAULT 'requested',
  created_at DATETIME NOT NULL,
  decided_at DATETIME NULL,
  UNIQUE KEY uq_rev_txn (txn_id),
  FOREIGN KEY (txn_id) REFERENCES payment_transactions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE member_credit_entries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  membership_id BIGINT UNSIGNED NOT NULL,
  amount_minor BIGINT NOT NULL,
  reason ENUM('overpayment','applied','payment_reversed','application_reversed') NOT NULL,
  txn_id BIGINT UNSIGNED NULL,
  allocation_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  KEY idx_mc_member (membership_id),
  FOREIGN KEY (membership_id) REFERENCES group_memberships(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE payment_reconciliation_runs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NULL,
  run_by BIGINT UNSIGNED NULL,
  summary TEXT NOT NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE financial_accounts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('asset','liability','equity','income','expense') NOT NULL,
  UNIQUE KEY uq_acct (group_id, code),
  FOREIGN KEY (group_id) REFERENCES `groups`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE ledger_journals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  ref_type VARCHAR(30) NOT NULL,
  ref_id BIGINT UNSIGNED NOT NULL,
  description VARCHAR(255) NOT NULL,
  reverses_journal_id BIGINT UNSIGNED NULL,
  posted_at DATETIME NOT NULL,
  created_by BIGINT UNSIGNED NULL,
  KEY idx_lj_ref (ref_type, ref_id),
  KEY idx_lj_group (group_id, posted_at),
  FOREIGN KEY (group_id) REFERENCES `groups`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE ledger_entries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  journal_id BIGINT UNSIGNED NOT NULL,
  account_id BIGINT UNSIGNED NOT NULL,
  membership_id BIGINT UNSIGNED NULL,
  debit_minor BIGINT NOT NULL DEFAULT 0,
  credit_minor BIGINT NOT NULL DEFAULT 0,
  KEY idx_le_journal (journal_id),
  KEY idx_le_account (account_id),
  FOREIGN KEY (journal_id) REFERENCES ledger_journals(id),
  FOREIGN KEY (account_id) REFERENCES financial_accounts(id),
  CHECK ((debit_minor > 0 AND credit_minor = 0) OR (credit_minor > 0 AND debit_minor = 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TRIGGER trg_le_no_update BEFORE UPDATE ON ledger_entries FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ledger entries are immutable'
;;
CREATE TRIGGER trg_le_no_delete BEFORE DELETE ON ledger_entries FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ledger entries are immutable'
;;
CREATE TRIGGER trg_lj_no_update BEFORE UPDATE ON ledger_journals FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ledger journals are immutable'
;;
CREATE TRIGGER trg_lj_no_delete BEFORE DELETE ON ledger_journals FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ledger journals are immutable'
;;
CREATE TRIGGER trg_pt_no_delete BEFORE DELETE ON payment_transactions FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'payment transactions cannot be deleted; use a reversal'
;;
CREATE TABLE group_expenses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  category VARCHAR(60) NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount_minor BIGINT NOT NULL,
  expense_date DATE NOT NULL,
  payee VARCHAR(150) NOT NULL,
  payment_method VARCHAR(30) NULL,
  reference VARCHAR(80) NULL,
  status ENUM('proposed','approved','rejected','paid','reversed') NOT NULL DEFAULT 'proposed',
  required_approvals TINYINT NOT NULL DEFAULT 1,
  requested_by BIGINT UNSIGNED NOT NULL,
  paid_by BIGINT UNSIGNED NULL,
  paid_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  KEY idx_ex_group (group_id, status, expense_date),
  FOREIGN KEY (group_id) REFERENCES `groups`(id),
  CHECK (amount_minor > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE expense_approvals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  expense_id BIGINT UNSIGNED NOT NULL,
  approver_user_id BIGINT UNSIGNED NOT NULL,
  decision ENUM('approve','reject') NOT NULL,
  comment VARCHAR(255) NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uq_exa (expense_id, approver_user_id),
  FOREIGN KEY (expense_id) REFERENCES group_expenses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  group_id BIGINT UNSIGNED NULL,
  category VARCHAR(30) NOT NULL,
  title VARCHAR(190) NOT NULL,
  body TEXT NOT NULL,
  link VARCHAR(255) NULL,
  read_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  KEY idx_n_user (user_id, read_at, created_at),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE notification_jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dedupe_key VARCHAR(160) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  group_id BIGINT UNSIGNED NULL,
  channel ENUM('in_app','email','sms') NOT NULL,
  category VARCHAR(30) NOT NULL,
  subject VARCHAR(190) NOT NULL,
  body TEXT NOT NULL,
  link VARCHAR(255) NULL,
  status ENUM('pending','sent','failed','skipped') NOT NULL DEFAULT 'pending',
  attempts TINYINT NOT NULL DEFAULT 0,
  max_attempts TINYINT NOT NULL DEFAULT 5,
  next_attempt_at DATETIME NOT NULL,
  last_error VARCHAR(255) NULL,
  created_at DATETIME NOT NULL,
  sent_at DATETIME NULL,
  UNIQUE KEY uq_job_dedupe (dedupe_key, channel),
  KEY idx_job_queue (status, next_attempt_at),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE notification_deliveries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id BIGINT UNSIGNED NOT NULL,
  attempt_no TINYINT NOT NULL,
  status VARCHAR(20) NOT NULL,
  detail VARCHAR(255) NULL,
  created_at DATETIME NOT NULL,
  KEY idx_nd_job (job_id),
  FOREIGN KEY (job_id) REFERENCES notification_jobs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE announcements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(190) NOT NULL,
  body TEXT NOT NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (group_id) REFERENCES `groups`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE savings_goals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  target_minor BIGINT NOT NULL,
  target_date DATE NULL,
  plan_id BIGINT UNSIGNED NULL,
  status ENUM('active','achieved','cancelled') NOT NULL DEFAULT 'active',
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (group_id) REFERENCES `groups`(id),
  CHECK (target_minor > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE savings_goal_allocations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  goal_id BIGINT UNSIGNED NOT NULL,
  amount_minor BIGINT NOT NULL,
  note VARCHAR(255) NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (goal_id) REFERENCES savings_goals(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(60) NOT NULL,
  entity_type VARCHAR(40) NULL,
  entity_id BIGINT UNSIGNED NULL,
  details TEXT NULL,
  ip VARCHAR(45) NULL,
  created_at DATETIME NOT NULL,
  KEY idx_audit_group (group_id, created_at),
  KEY idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TRIGGER trg_audit_no_update BEFORE UPDATE ON audit_logs FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'audit log is append-only'
;;
CREATE TRIGGER trg_audit_no_delete BEFORE DELETE ON audit_logs FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'audit log is append-only'
;;
CREATE TABLE platform_settings (
  k VARCHAR(80) PRIMARY KEY,
  v TEXT NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE scheduled_job_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job VARCHAR(60) NOT NULL,
  status ENUM('ok','error') NOT NULL,
  message VARCHAR(500) NULL,
  started_at DATETIME NOT NULL,
  finished_at DATETIME NOT NULL,
  KEY idx_sjl (job, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE integration_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  integration VARCHAR(30) NOT NULL,
  level ENUM('info','error') NOT NULL,
  message VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL,
  KEY idx_il (integration, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE backup_runs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  file VARCHAR(255) NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  sha256 CHAR(64) NULL,
  status ENUM('ok','failed') NOT NULL,
  verified_at DATETIME NULL,
  message VARCHAR(255) NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
;;
CREATE TABLE sandbox_stk (
  checkout_id VARCHAR(100) PRIMARY KEY,
  merchant_id VARCHAR(100) NOT NULL,
  amount_minor BIGINT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  state ENUM('prompted','success','cancelled','insufficient') NOT NULL DEFAULT 'prompted',
  receipt VARCHAR(30) NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
