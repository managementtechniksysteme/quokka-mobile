import {z} from 'zod';

export const UserPermissionSchema = z.enum([
  // accounting
  'accounting.view.own',
  'accounting.view.other',
  'accounting.create',
  'accounting.update.own',
  'accounting.update.other',
  'accounting.delete.own',
  'accounting.delete.other',
  'accounting.email',
  'accounting.createpdf',

  // additions reports
  'additions-reports.view.own',
  'additions-reports.view.involved',
  'additions-reports.view.other',
  'additions-reports.create',
  'additions-reports.update.own',
  'additions-reports.update.involved',
  'additions-reports.update.other',
  'additions-reports.delete.own',
  'additions-reports.delete.involved',
  'additions-reports.delete.other',
  'additions-reports.email.own',
  'additions-reports.email.involved',
  'additions-reports.email.other',
  'additions-reports.createpdf.own',
  'additions-reports.createpdf.involved',
  'additions-reports.createpdf.other',
  'additions-reports.send-signature-request.own',
  'additions-reports.send-signature-request.involved',
  'additions-reports.send-signature-request.other',
  'additions-reports.send-download-request.own',
  'additions-reports.send-download-request.involved',
  'additions-reports.send-download-request.other',
  'additions-reports.get-signature.own',
  'additions-reports.get-signature.involved',
  'additions-reports.get-signature.other',
  'additions-reports.approve',

  // addresses
  'addresses.view',
  'addresses.create',
  'addresses.update',
  'addresses.delete',
  'addresses.email',
  'addresses.createpdf',

  // application settings
  'application-settings.update.general',

  // companies
  'companies.view',
  'companies.create',
  'companies.update',
  'companies.delete',
  'companies.email',
  'companies.createpdf',

  // construction reports
  'construction-reports.view.own',
  'construction-reports.view.involved',
  'construction-reports.view.other',
  'construction-reports.create',
  'construction-reports.update.own',
  'construction-reports.update.involved',
  'construction-reports.update.other',
  'construction-reports.delete.own',
  'construction-reports.delete.involved',
  'construction-reports.delete.other',
  'construction-reports.email.own',
  'construction-reports.email.involved',
  'construction-reports.email.other',
  'construction-reports.createpdf.own',
  'construction-reports.createpdf.involved',
  'construction-reports.createpdf.other',
  'construction-reports.send-signature-request.own',
  'construction-reports.send-signature-request.involved',
  'construction-reports.send-signature-request.other',
  'construction-reports.send-download-request.own',
  'construction-reports.send-download-request.involved',
  'construction-reports.send-download-request.other',
  'construction-reports.get-signature.own',
  'construction-reports.get-signature.involved',
  'construction-reports.get-signature.other',
  'construction-reports.approve',

  // employees
  'employees.view',
  'employees.create',
  'employees.update',
  'employees.delete',
  'employees.email',
  'employees.createpdf',
  'employees.impersonate',

  // exceptions
  'exceptions.view',
  'exceptions.delete',

  // finances
  'finances.view',
  'finances.createpdf',

  // finance groups
  'finance-groups.view',
  'finance-groups.create',
  'finance-groups.update',
  'finance-groups.delete',

  // finance records
  'finance-records.view',
  'finance-records.create',
  'finance-records.update',
  'finance-records.delete',

  // flow meter inspection reports
  'flow-meter-inspection-reports.view.own',
  'flow-meter-inspection-reports.view.other',
  'flow-meter-inspection-reports.create',
  'flow-meter-inspection-reports.update.own',
  'flow-meter-inspection-reports.update.other',
  'flow-meter-inspection-reports.delete.own',
  'flow-meter-inspection-reports.delete.other',
  'flow-meter-inspection-reports.email.own',
  'flow-meter-inspection-reports.email.other',
  'flow-meter-inspection-reports.createpdf.own',
  'flow-meter-inspection-reports.createpdf.other',
  'flow-meter-inspection-reports.send-signature-request.own',
  'flow-meter-inspection-reports.send-signature-request.other',
  'flow-meter-inspection-reports.send-download-request.own',
  'flow-meter-inspection-reports.send-download-request.other',
  'flow-meter-inspection-reports.get-signature.own',
  'flow-meter-inspection-reports.get-signature.other',
  'flow-meter-inspection-reports.approve',

  // help
  'help.view',

  // inspection reports
  'inspection-reports.view.own',
  'inspection-reports.view.other',
  'inspection-reports.create',
  'inspection-reports.update.own',
  'inspection-reports.update.other',
  'inspection-reports.delete.own',
  'inspection-reports.delete.other',
  'inspection-reports.email.own',
  'inspection-reports.email.other',
  'inspection-reports.createpdf.own',
  'inspection-reports.createpdf.other',
  'inspection-reports.send-signature-request.own',
  'inspection-reports.send-signature-request.other',
  'inspection-reports.send-download-request.own',
  'inspection-reports.send-download-request.other',
  'inspection-reports.get-signature.own',
  'inspection-reports.get-signature.other',
  'inspection-reports.approve',

  // logbook
  'logbook.view.own',
  'logbook.view.other',
  'logbook.create',
  'logbook.update.own',
  'logbook.update.other',
  'logbook.delete.own',
  'logbook.delete.other',
  'logbook.email',
  'logbook.createpdf',

  // material services
  'material-services.view',
  'material-services.create',
  'material-services.update',
  'material-services.delete',
  'material-services.email',
  'material-services.createpdf',

  // memos
  'memos.view.sender',
  'memos.view.recipient',
  'memos.view.present',
  'memos.view.notified',
  'memos.view.other',
  'memos.create',
  'memos.update.sender',
  'memos.update.recipient',
  'memos.update.present',
  'memos.update.notified',
  'memos.update.other',
  'memos.delete.sender',
  'memos.delete.recipient',
  'memos.delete.present',
  'memos.delete.notified',
  'memos.delete.other',
  'memos.email.sender',
  'memos.email.recipient',
  'memos.email.present',
  'memos.email.notified',
  'memos.email.other',
  'memos.createpdf.sender',
  'memos.createpdf.recipient',
  'memos.createpdf.present',
  'memos.createpdf.notified',
  'memos.createpdf.other',

  // notes
  'notes.view',
  'notes.create',
  'notes.update',
  'notes.delete',
  'notes.email',
  'notes.createpdf',

  // people
  'people.view',
  'people.create',
  'people.update',
  'people.delete',
  'people.email',
  'people.createpdf',

  // projects
  'projects.view',
  'projects.view.estimates',
  'projects.create',
  'projects.update',
  'projects.delete',
  'projects.email',
  'projects.createpdf',

  // project interim invoices
  'interim-invoices.view',
  'interim-invoices.create',
  'interim-invoices.update',
  'interim-invoices.delete',

  // roles
  'roles.view',
  'roles.create',
  'roles.update',
  'roles.delete',
  'roles.email',
  'roles.createpdf',

  // search
  'search',

  // service reports
  'service-reports.view.own',
  'service-reports.view.other',
  'service-reports.create',
  'service-reports.update.own',
  'service-reports.update.other',
  'service-reports.delete.own',
  'service-reports.delete.other',
  'service-reports.email.own',
  'service-reports.email.other',
  'service-reports.createpdf.own',
  'service-reports.createpdf.other',
  'service-reports.send-signature-request.own',
  'service-reports.send-signature-request.other',
  'service-reports.send-download-request.own',
  'service-reports.send-download-request.other',
  'service-reports.get-signature.own',
  'service-reports.get-signature.other',
  'service-reports.approve',

  // tasks
  'tasks.view.responsible',
  'tasks.view.involved',
  'tasks.view.other',
  'tasks.view.private.responsible',
  'tasks.view.private.involved',
  'tasks.view.private.other',
  'tasks.create',
  'tasks.create.private',
  'tasks.update.responsible',
  'tasks.update.involved',
  'tasks.update.other',
  'tasks.update.private.responsible',
  'tasks.update.private.involved',
  'tasks.update.private.other',
  'tasks.delete.responsible',
  'tasks.delete.involved',
  'tasks.delete.other',
  'tasks.delete.private.responsible',
  'tasks.delete.private.involved',
  'tasks.delete.private.other',
  'tasks.email.responsible',
  'tasks.email.involved',
  'tasks.email.other',
  'tasks.email.private.responsible',
  'tasks.email.private.involved',
  'tasks.email.private.other',
  'tasks.createpdf.responsible',
  'tasks.createpdf.involved',
  'tasks.createpdf.other',
  'tasks.createpdf.private.responsible',
  'tasks.createpdf.private.involved',
  'tasks.createpdf.private.other',

  // task comments
  'tasks.comments.create',
  'tasks.comments.update.own',
  'tasks.comments.update.other',
  'tasks.comments.delete.own',
  'tasks.comments.delete.other',

  // tools
  'tools.viewlatestchanges',
  'tools.viewsentemails',
  'tools.scanqr',

  // user settings

  // vehicles
  'vehicles.view',
  'vehicles.create',
  'vehicles.update',
  'vehicles.delete',
  'vehicles.email',
  'vehicles.createpdf',

  // wage services
  'wage-services.view',
  'wage-services.create',
  'wage-services.update',
  'wage-services.delete',
  'wage-services.email',
  'wage-services.createpdf',
]);

export const UserPermissionsSchema = z.array(UserPermissionSchema);

export type Permission = z.infer<typeof UserPermissionSchema>;