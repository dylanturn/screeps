/**
 * The complex template component data structure.
 * @typedef {Object} ComplexComponent
 * @property {String} type - The type of structure in this component
 * @property {Number[]} pos - The position offset that will be applied to the template origin.
 * @property {boolean} conn - Indicates whether this component can be used as a connection point for another complex.
 */

/**
 * The Complex data structure.
 * @typedef {Object} Complex
 * @property {String} template   - The type of structure in this component
 * @property {String} room_name  - The name of the room this complex is in
 * @property {Number} position_x - The X coordinate of this complex
 * @property {Number} position_y - The Y coordinate of this complex
 * @property {Number} length_x   - The X length of this complex
 * @property {Number} length_y   - The Y length of this complex
 * @property {ComplexComponent[]} components - An array of all the complexes components. 
 * @property {ComplexComponent[]} connectors - An array of the complexes connectors.
 */
