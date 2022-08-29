
// #region notes
// gravity/drag equations (from https://burakkanber.com/blog/modeling-physics-javascript-gravity-and-drag/ &&
// https://jsfiddle.net/bkanber/39jrM/)

// drag
/*

CD is drag coefficient
ρ = 1.22 (kg / m3) = the density of air
-0.5 is negative because the force pushes Against
    FD = -0.5 * CD * A * ρ * v2
    ||
    FD, x = -0.5 * CD * A * ρ * vx2
    FD, y = -0.5 * CD * A * ρ * vy2
*/

// ag is accel. due to gravity 

// var Cd = 0.47;  // Dimensionless
// var rho = 1.22; // kg / m^3
// var A = Math.PI * blue.radius * blue.radius / (10000); // m^2
// var ag = 9.81;  // m / s^2
// var Fx = -0.5 * Cd * A * rho * blue.velocity.x * blue.velocity.x * blue.velocity.x / Math.abs(blue.velocity.x);
// var Fy = -0.5 * Cd * A * rho * blue.velocity.y * blue.velocity.y * blue.velocity.y / Math.abs(blue.velocity.y);

// #endregion