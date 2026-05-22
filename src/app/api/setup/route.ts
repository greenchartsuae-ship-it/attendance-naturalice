import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        section VARCHAR(100) NOT NULL,
        grp VARCHAR(50) NOT NULL,
        location VARCHAR(100) DEFAULT '',
        active BOOLEAN DEFAULT TRUE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES employees(id),
        date DATE NOT NULL,
        status VARCHAR(20) NOT NULL,
        UNIQUE(employee_id, date)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin'
      )
    `;

    // Insert employees
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (46, 'ALAMGEER', 'DRIVER - ABU DHABI', 'DRIVERS', 'AL AIN 3') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (47, 'KUMAR', 'DRIVER - ABU DHABI', 'DRIVERS', 'AD 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (48, 'MASOOD', 'DRIVER - ABU DHABI', 'DRIVERS', 'AD 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (49, 'SULAIMAN', 'DRIVER - ABU DHABI', 'DRIVERS', 'AL AIN 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (50, 'TAMIL', 'DRIVER - ABU DHABI', 'DRIVERS', 'BANIYAS 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (53, 'UZAIR (FREELANCER)', 'DRIVER - ABU DHABI', 'DRIVERS', 'ABU DHABI 3') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (51, 'YASIR', 'DRIVER - ABU DHABI', 'DRIVERS', 'AL AIN 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (52, 'ZAMEER GUL', 'DRIVER - ABU DHABI', 'DRIVERS', 'BANIYAS 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (29, 'AMEEN', 'DRIVER - DUBAI', 'DRIVERS', 'AD WAREHOUSE') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (30, 'AMEER', 'DRIVER - DUBAI', 'DRIVERS', 'DRIVER') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (31, 'ASHWAQ (FREELANCER)', 'DRIVER - DUBAI', 'DRIVERS', 'DEIRA 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (32, 'BASIT (FREELANCER)', 'DRIVER - DUBAI', 'DRIVERS', 'BUR DUBAI') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (33, 'HAFILNASRULLAH', 'DRIVER - DUBAI', 'DRIVERS', 'FACTORY 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (34, 'HAFIZ', 'DRIVER - DUBAI', 'DRIVERS', 'DRIVER') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (35, 'HAMEED', 'DRIVER - DUBAI', 'DRIVERS', 'INTL CITY') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (36, 'HENOK', 'DRIVER - DUBAI', 'DRIVERS', 'UNION COOP') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (37, 'INAYATH ULLAH', 'DRIVER - DUBAI', 'DRIVERS', 'SATWA') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (38, 'KHALIL', 'DRIVER - DUBAI', 'DRIVERS', 'DRIVER') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (39, 'LATIF (FREELANCER)', 'DRIVER - DUBAI', 'DRIVERS', 'REPLACEMENT') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (40, 'MH. SAKIB', 'DRIVER - DUBAI', 'DRIVERS', 'FACTORY 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (41, 'NAYON', 'DRIVER - DUBAI', 'DRIVERS', 'AL BARSHA 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (42, 'NIAZ GUL', 'DRIVER - DUBAI', 'DRIVERS', 'AD CREDIT') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (43, 'QASIM', 'DRIVER - DUBAI', 'DRIVERS', 'AL QUOZ') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (44, 'RAHIMAN', 'DRIVER - DUBAI', 'DRIVERS', 'BUS DRIVER') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (45, 'SIRAS (FREELANCER-NEW)', 'DRIVER - DUBAI', 'DRIVERS', 'AL BARSHA 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (62, 'AJMAL UDDIN', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FISHERMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (63, 'MOHAMED ZAKIR', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FISHERMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (60, 'MUJAHID', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FUJAIRAH 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (61, 'REHMAT GUL', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FISHERMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (59, 'RIAZ', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FUJAIRAH 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (54, 'HASSENE', 'DRIVER - OTHER EMIRATES', 'DRIVERS', 'UMQ') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (56, 'LAL KHAN', 'DRIVER - OTHER EMIRATES', 'DRIVERS', 'SHARJAH 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (55, 'NASEEBULAH', 'DRIVER - OTHER EMIRATES', 'DRIVERS', 'SHARJAH 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (57, 'SALEEM', 'DRIVER - OTHER EMIRATES', 'DRIVERS', 'AJMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (58, 'TAYEB', 'DRIVER - OTHER EMIRATES', 'DRIVERS', 'RAK 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (100, 'HEMANTH', 'AL QUOZ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (101, 'NABEEL', 'AL QUOZ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (99, 'RASAL', 'AL QUOZ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (102, 'VISHNU', 'AL QUOZ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (116, 'AJITH', 'FUJAIRAH FACTORY', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (117, 'AL AMEEN', 'FUJAIRAH FACTORY', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (90, 'ALAMIN', 'NIGHT SHIFT - AL QUOZ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (91, 'ARUN SURESH', 'NIGHT SHIFT - AL QUOZ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (92, 'BIRUK', 'NIGHT SHIFT - AL QUOZ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (93, 'HARI', 'NIGHT SHIFT - AL QUOZ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (94, 'IMRAN', 'NIGHT SHIFT - AL QUOZ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (95, 'WASSEM', 'NIGHT SHIFT - AL QUOZ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (107, 'ARIF PROD', 'NIGHT SHIFT - UMQ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (108, 'IMRAN KHAN', 'NIGHT SHIFT - UMQ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (109, 'YOUSAF-EGY', 'NIGHT SHIFT - UMQ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (96, 'AHMED', 'PROD - LUXURY ICE', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (97, 'BIPLOP', 'PROD - LUXURY ICE', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (98, 'MASOM', 'PROD - LUXURY ICE', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (103, 'ADNAN', 'UMQ PRODUCTION', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (104, 'JAMES', 'UMQ PRODUCTION', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (105, 'RAKIB', 'UMQ PRODUCTION', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (106, 'SIRAZ', 'UMQ PRODUCTION', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (111, 'ATEF', 'UMQ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (110, 'GADOUR', 'UMQ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (112, 'MOHAMMED GADOUR', 'UMQ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (113, 'SAIFUL', 'UMQ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (114, 'SANJOY', 'UMQ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (115, 'SOROREAR', 'UMQ TECHNICIAN', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (26, 'ENDIMO', 'ACCOMMODATION', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (2, 'ASHWIN', 'ADMIN', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (3, 'ASMA', 'ADMIN', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (1, 'IMED', 'ADMIN', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (4, 'JESSA', 'ADMIN', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (5, 'REDOUANE LAFFILI', 'ADMIN', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (6, 'ROSNA', 'ADMIN', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (7, 'SIWAR', 'ADMIN', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (8, 'VENISSE', 'ADMIN', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (9, 'YASEER', 'ADMIN', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (22, 'MICHAEL', 'CLEANER', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (23, 'SAMUEL', 'CLEANER', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (28, 'SAJAD', 'HOUSE DRIVER', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (27, 'ZIA', 'HOUSE DRIVER', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (14, 'BINCY', 'HYGIENE DEPT', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (19, 'ALBERT', 'PROD - LUXURY ICE', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (20, 'MAHMOUD', 'PROD - LUXURY ICE', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (21, 'SAKIB', 'PROD - LUXURY ICE', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (15, 'LITO', 'PRODUCTION', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (16, 'MANI', 'PRODUCTION', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (17, 'MURUGESAN', 'PRODUCTION', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (18, 'SURIYA', 'PRODUCTION', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (13, 'RAFEEQ', 'PRODUCTION HEAD', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (10, 'FIRAS', 'SALES SUPERVISOR', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (12, 'OMAR', 'SALES SUPERVISOR', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (11, 'SIVA', 'SALES SUPERVISOR', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (24, 'INAM', 'VEHICLE MAINTENANCE', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (25, 'NADEEM', 'VEHICLE MAINTENANCE', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (75, 'JANE ALAM', 'SALESMAN - ABU DHABI', 'SALESMAN', 'BANI YAS 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (76, 'JONAIDUL (FREELANCER)', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AL AIN 3') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (77, 'MOZIB', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AD 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (78, 'NEJAMUL (FREELANCER)', 'SALESMAN - ABU DHABI', 'SALESMAN', 'REPLACEMENT') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (79, 'RUBEL', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AL AIN 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (80, 'SABEER', 'SALESMAN - ABU DHABI', 'SALESMAN', 'BANIYAS 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (81, 'SHAHEED', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AD 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (82, 'UKIL', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AL AIN 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (65, 'ARIF', 'SALESMAN - DUBAI', 'SALESMAN', 'INTL CITY') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (66, 'ARUN', 'SALESMAN - DUBAI', 'SALESMAN', 'SATWA') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (67, 'FAROOK', 'SALESMAN - DUBAI', 'SALESMAN', 'AL BARSHA 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (68, 'GOPI', 'SALESMAN - DUBAI', 'SALESMAN', 'BUR DUBAI') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (69, 'JUSTIN', 'SALESMAN - DUBAI', 'SALESMAN', 'FACT 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (70, 'MEGHA', 'SALESMAN - DUBAI', 'SALESMAN', 'DEIRA 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (64, 'MOHAMED AMINE', 'SALESMAN - DUBAI', 'SALESMAN', 'UNION COOP') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (71, 'SAHIL', 'SALESMAN - DUBAI', 'SALESMAN', 'FACTORY 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (72, 'SANATH', 'SALESMAN - DUBAI', 'SALESMAN', 'AL QUOZ') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (73, 'SHYAM', 'SALESMAN - DUBAI', 'SALESMAN', 'DEIRA 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (74, 'SHYAM NEW', 'SALESMAN - DUBAI', 'SALESMAN', 'AL BARSHA 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (88, 'AJMAL', 'SALESMAN - FUJAIRAH', 'SALESMAN', 'FUJAIRAH 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (89, 'SHIBLI', 'SALESMAN - FUJAIRAH', 'SALESMAN', 'FUJAIRAH 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (84, 'ABDULLAH', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'SHARJAH 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (83, 'NOMAN', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'SHARJAH 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (85, 'RAJEEV', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'AJMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (86, 'SUNAIF', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'RAK 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (87, 'UMAR F. (FREELANCER)', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'UMQ') ON CONFLICT (id) DO NOTHING`;

    // Reset sequence
    await sql`SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees))`;

    // Insert default admin
    await sql`INSERT INTO admin_users (username, password, role) VALUES ('admin', 'admin123', 'admin') ON CONFLICT (username) DO NOTHING`;

    return NextResponse.json({ success: true, message: 'Database setup complete with 117 employees' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
