import {
	type PgTableWithColumns,
	boolean,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

// Document type enum
export const documentTypeEnum = pgEnum("document_type", [
	"id_card",
	"passport",
	"drivers_license",
	"national_id",
	"voters_card",
	"cac_registration",
	"other",
]);

// Users table
export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	name: varchar("name", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	isVerified: boolean("is_verified").default(false),
	documentVerificationId: uuid("document_verification_id"),
	verificationCode: varchar("verification_code", { length: 6 }),
	verificationCodeExpires: timestamp("verification_code_expires"),
	resetPasswordCode: varchar("reset_password_code", { length: 64 }),
	resetPasswordExpires: timestamp("reset_password_expires"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
}) as PgTableWithColumns<any>;

// Document Verification table
export const documentVerifications = pgTable("document_verifications", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull(),
	idDoc: varchar("id_doc", { length: 255 }),
	cacDoc: varchar("cac_doc", { length: 255 }),
	uploadedDocAt: timestamp("uploaded_doc_at"),
	isDocVerified: boolean("is_doc_verified").default(false),
	verificationStatus: varchar("verification_status", { length: 50 }).default(
		"pending",
	), // pending, approved, rejected
	rejectionReason: text("rejection_reason"),
	verifiedBy: uuid("verified_by"),
	verifiedAt: timestamp("verified_at"),
	documentType: documentTypeEnum("document_type").notNull(),
	documentNumber: varchar("document_number", { length: 100 }),
	documentExpiryDate: timestamp("document_expiry_date"),
	documentIssuingCountry: varchar("document_issuing_country", { length: 100 }),
	documentIssuingAuthority: varchar("document_issuing_authority", {
		length: 255,
	}),
	documentFrontImage: varchar("document_front_image", { length: 255 }),
	documentBackImage: varchar("document_back_image", { length: 255 }),
	selfieImage: varchar("selfie_image", { length: 255 }),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
}) as PgTableWithColumns<any>;

// Roles table
export const roles = pgTable("roles", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 100 }).notNull().unique(),
	description: text("description"),
	isSystem: boolean("is_system").default(false), // For system-defined roles
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Permissions table
export const permissions = pgTable("permissions", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 100 }).notNull().unique(), // e.g., "token:create", "token:update"
	description: text("description"),
	resource: varchar("resource", { length: 100 }).notNull(), // e.g., "token", "user"
	action: varchar("action", { length: 100 }).notNull(), // e.g., "create", "read", "update", "delete", "all"
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Role-Permission mapping (many-to-many)
export const rolePermissions = pgTable(
	"role_permissions",
	{
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		permissionId: uuid("permission_id")
			.notNull()
			.references(() => permissions.id, { onDelete: "cascade" }),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
	}),
);

// User-Role mapping (many-to-many)
export const userRoles = pgTable(
	"user_roles",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		assignedAt: timestamp("assigned_at").defaultNow(),
		assignedBy: uuid("assigned_by").references(() => users.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.roleId] }),
	}),
);
