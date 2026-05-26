import { getSQL } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const sql = getSQL();
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
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (119, 'ASHWIN', 'ADMIN', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (120, 'ASMA', 'ADMIN', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (118, 'IMED', 'ADMIN', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (121, 'JESSA', 'ADMIN', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (122, 'REDOUANE LAFFILI', 'ADMIN', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (123, 'ROSNA', 'ADMIN', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (124, 'SIWAR', 'ADMIN', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (125, 'VENISSE', 'ADMIN', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (126, 'YASEER', 'ADMIN', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (206, 'HADEE', 'JELAT', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (205, 'YOUSAF', 'JELAT', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (127, 'FIRAS', 'SALES SUPERVISOR', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (128, 'SIVA', 'SALES SUPERVISOR', 'ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (236, 'WONOIMU', 'ACCOMMODATION', 'CLEANER', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (138, 'MICHAEL', 'CLEANER', 'CLEANER', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (139, 'SAMUEL', 'CLEANER', 'CLEANER', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (140, 'ALAMGEER', 'DRIVER - ABU DHABI', 'DRIVERS', 'AL AIN 3') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (153, 'KUMAR', 'DRIVER - ABU DHABI', 'DRIVERS', 'AD 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (155, 'MASOOD', 'DRIVER - ABU DHABI', 'DRIVERS', 'AD 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (167, 'SULAIMAN', 'DRIVER - ABU DHABI', 'DRIVERS', 'AL AIN 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (168, 'TAMIL', 'DRIVER - ABU DHABI', 'DRIVERS', 'BANIYAS 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (171, 'UZAIR (FREELANCER)', 'DRIVER - ABU DHABI', 'DRIVERS', 'ABU DHABI 3') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (172, 'YASIR', 'DRIVER - ABU DHABI', 'DRIVERS', 'AL AIN 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (173, 'ZAMEER GUL', 'DRIVER - ABU DHABI', 'DRIVERS', 'BAN 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (141, 'ADEEL (FREELANCER)', 'DRIVER - DUBAI', 'DRIVERS', 'REPLACEMENT') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (142, 'AMEEN', 'DRIVER - DUBAI', 'DRIVERS', 'AD WAREHOUSE') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (144, 'ASHWAQ (FREELANCER)', 'DRIVER - DUBAI', 'DRIVERS', 'DEIRA 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (145, 'BASIT (FREELANCER)', 'DRIVER - DUBAI', 'DRIVERS', 'BUR DUBAI') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (146, 'HAFILNASRULLAH', 'DRIVER - DUBAI', 'DRIVERS', 'FACT 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (147, 'HAFIZ', 'DRIVER - DUBAI', 'DRIVERS', 'VACATION') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (148, 'HAMEED', 'DRIVER - DUBAI', 'DRIVERS', 'INT CITY') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (150, 'HENOK', 'DRIVER - DUBAI', 'DRIVERS', 'UNION COOP') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (151, 'INAYATH ULLAH', 'DRIVER - DUBAI', 'DRIVERS', 'SATWA') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (152, 'KHALIL', 'DRIVER - DUBAI', 'DRIVERS', 'AL QUOZ') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (156, 'MH. SAKIB', 'DRIVER - DUBAI', 'DRIVERS', 'FACT 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (159, 'NAYON', 'DRIVER - DUBAI', 'DRIVERS', 'AL BARSHA 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (160, 'NIAZ GUL', 'DRIVER - DUBAI', 'DRIVERS', 'AD CREDIT') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (161, 'QASIM', 'DRIVER - DUBAI', 'DRIVERS', 'CREDIT LOC') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (163, 'RAHIMAN', 'DRIVER - DUBAI', 'DRIVERS', 'BUS DRIVER') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (166, 'SIRAS (FREELANCER)', 'DRIVER - DUBAI', 'DRIVERS', 'AL BARSHA 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (170, 'UMER', 'DRIVER - DUBAI', 'DRIVERS', 'DEIRA 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (239, 'AJMAL UDDIN', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FISHERMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (240, 'MOHAMED ZAKIR', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FISHERMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (157, 'MUJAHID', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FUJ 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (241, 'REHMAT GUL', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FISHERMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (164, 'RIAZ', 'DRIVER - FUJAIRAH', 'DRIVERS', 'FUJ 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (162, 'QASIM ESSA (FREELANCER)', 'DRIVER - OTHER EMIRATES', 'DRIVERS', 'AJMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (143, 'AMEER', 'DRIVERS', 'DRIVERS', 'VACATION') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (149, 'HASSENE', 'DRIVERS', 'DRIVERS', 'UMQ') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (154, 'LAL KHAN', 'DRIVERS', 'DRIVERS', 'SHAR 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (158, 'NASEEBULAH', 'DRIVERS', 'DRIVERS', 'SHAR 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (165, 'SALEEM', 'DRIVERS', 'DRIVERS', 'VACATION') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (169, 'TAYEB', 'DRIVERS', 'DRIVERS', 'RAK') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (219, 'SAJAD', 'HOUSE DRIVER', 'DRIVERS', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (220, 'ZIYA', 'HOUSE DRIVER', 'DRIVERS', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (214, 'HEMANTH', 'AL QUOZ TECHNICIAN', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (215, 'NABEEL', 'AL QUOZ TECHNICIAN', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (213, 'RASAL', 'AL QUOZ TECHNICIAN', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (135, 'ALBERT', 'PROD - LUXURY ICE', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (136, 'MAHMOUD', 'PROD - LUXURY ICE', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (137, 'SAKIB', 'PROD - LUXURY ICE', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (131, 'AJITH', 'PRODUCTION', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (132, 'LITO', 'PRODUCTION', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (133, 'MANI', 'PRODUCTION', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (134, 'SURIYA', 'PRODUCTION', 'DUBAI FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (223, 'ALAMIN', 'NIGHT SHIFT - AL QUOZ', 'DUBAI FACTORY NIGHT', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (224, 'ARUN SURESH', 'NIGHT SHIFT - AL QUOZ', 'DUBAI FACTORY NIGHT', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (225, 'BIRUK', 'NIGHT SHIFT - AL QUOZ', 'DUBAI FACTORY NIGHT', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (226, 'HARI', 'NIGHT SHIFT - AL QUOZ', 'DUBAI FACTORY NIGHT', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (227, 'IMRAN', 'NIGHT SHIFT - AL QUOZ', 'DUBAI FACTORY NIGHT', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (228, 'WASSEM', 'NIGHT SHIFT - AL QUOZ', 'DUBAI FACTORY NIGHT', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (229, 'AHMED', 'PROD NIGHT - LUXURY ICE', 'DUBAI FACTORY NIGHT', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (230, 'BIPLOP', 'PROD NIGHT - LUXURY ICE', 'DUBAI FACTORY NIGHT', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (231, 'MASOM', 'PROD NIGHT - LUXURY ICE', 'DUBAI FACTORY NIGHT', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (217, 'AL AMEEN', 'FUJAIRAH FACTORY', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (218, 'VISHNU', 'FUJAIRAH FACTORY', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (232, 'ADNAN', 'NIGHT SHIFT - UMQ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (233, 'ARIF', 'NIGHT SHIFT - UMQ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (234, 'IMRAN KHAN', 'NIGHT SHIFT - UMQ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (235, 'MURUGESAN', 'NIGHT SHIFT - UMQ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (243, 'MURUGESAN', 'NIGHT SHIFT - UMQ', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (201, 'JAMES', 'UMQ PRODUCTION', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (202, 'RAKIB', 'UMQ PRODUCTION', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (203, 'SIRAZ', 'UMQ PRODUCTION', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (204, 'YOUSAF-EGY', 'UMQ PRODUCTION', 'FACTORY/PRODUCTION', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (221, 'INAM', 'VEHICLE MAINTENANCE', 'MECHANIC', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (222, 'NADEEM', 'VEHICLE MAINTENANCE', 'MECHANIC', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (129, 'BINCY', 'HYGIENE DEPT', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (130, 'RAFEEQ', 'PRODUCTION HEAD', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (216, 'OMAR', 'SALES SUPERVISOR', 'OFFICE/ADMIN', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (197, 'SWALIH', 'SALESMAN', 'SALESMAN', 'AD CREDIT') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (180, 'JANE ALAM', 'SALESMAN - ABU DHABI', 'SALESMAN', 'BAN 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (181, 'JONAIDUL (FREELANCER)', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AL AIN 3') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (185, 'MOZIB', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AD 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (186, 'NEJAMUL (FREELANCER)', 'SALESMAN - ABU DHABI', 'SALESMAN', 'ABU DHABI 3') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (189, 'RUBEL', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AL AIN 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (190, 'SABEER', 'SALESMAN - ABU DHABI', 'SALESMAN', 'BAN 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (193, 'SHAHEED', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AD 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (199, 'UKIL', 'SALESMAN - ABU DHABI', 'SALESMAN', 'AL AIN 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (176, 'ARIF', 'SALESMAN - DUBAI', 'SALESMAN', 'INT CITY') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (177, 'ARUN', 'SALESMAN - DUBAI', 'SALESMAN', 'SATVA') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (178, 'FAROOK', 'SALESMAN - DUBAI', 'SALESMAN', 'BARSHA 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (179, 'GOPI', 'SALESMAN - DUBAI', 'SALESMAN', 'BUR DUBAI') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (182, 'JUSTIN', 'SALESMAN - DUBAI', 'SALESMAN', 'FACT 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (183, 'MEGHA', 'SALESMAN - DUBAI', 'SALESMAN', 'DEIRA 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (184, 'MOHAMED AMINE', 'SALESMAN - DUBAI', 'SALESMAN', 'UNION COOP') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (191, 'SAHIL', 'SALESMAN - DUBAI', 'SALESMAN', 'FACT 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (192, 'SANATH', 'SALESMAN - DUBAI', 'SALESMAN', 'AL QUOZ') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (195, 'SHYAM', 'SALESMAN - DUBAI', 'SALESMAN', 'DEIRA 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (242, 'SHYAM RAVI', 'SALESMAN - DUBAI', 'SALESMAN', 'AL BARSHA 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (175, 'AJMAL', 'SALESMAN - FUJAIRAH', 'SALESMAN', 'FUJ 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (194, 'SHIBILI', 'SALESMAN - FUJAIRAH', 'SALESMAN', 'FUJ 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (174, 'ABDULLAH', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'SHAR 2') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (187, 'NOMAN', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'SHAR 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (188, 'RAJEEV', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'AJMAN') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (198, 'SUNAIF', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'RAK 1') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (200, 'UMAR F. (FREELANCER)', 'SALESMAN - OTHER EMIRATES', 'SALESMAN', 'UMQ') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (208, 'ATEF', 'UMQ - TECHNICIAN', 'UMQ FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (207, 'GADOUR', 'UMQ - TECHNICIAN', 'UMQ FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (209, 'MOHAMMED GADOUR', 'UMQ - TECHNICIAN', 'UMQ FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (210, 'SAIFUL', 'UMQ - TECHNICIAN', 'UMQ FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (211, 'SANJOY', 'UMQ - TECHNICIAN', 'UMQ FACTORY', '') ON CONFLICT (id) DO NOTHING`;
    await sql`INSERT INTO employees (id, name, section, grp, location) VALUES (212, 'SOROREAR', 'UMQ - TECHNICIAN', 'UMQ FACTORY', '') ON CONFLICT (id) DO NOTHING`;

    // Reset sequence
    await sql`SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees))`;

    // Insert default admin
    await sql`INSERT INTO admin_users (username, password, role) VALUES ('admin', 'admin123', 'admin') ON CONFLICT (username) DO NOTHING`;

    return NextResponse.json({ success: true, message: 'Database setup complete with 123 employees' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
