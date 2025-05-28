// @author: 321_Closet
/* 
    @description: a multi-use library written in typescript
    indented for use inside the berry game framework for ROBLOX
*/

const MAX_LIST_LENGTH = 10;

export class c_EnumList {
	public list;
	public l_name;
	constructor(name: string, array: []) {
		this.l_name = name;
		assert(array.length > MAX_LIST_LENGTH, "Enum Lists may not exceed threshold of 10 strings");
		this.list = array;
		table.freeze(this.list);
	}

	/**
	 * @method BelongsTo: Ask if a certain const char is a member of a list
	 * in this case the list object of which the method is called
	 */
	public BelongsTo(obj: string) {
		let i = 0;
		for (i = 0; i <= this.list.length; i++) {
			if (this.list[i] === obj) {
				return true;
			} else {
				return false;
			}
		}
	}

	/**
	 * @method GetEnumItems: Return a read-only array of the objects enum items
	 */
	public GetEnumItems(): [] {
		return this.list;
	}

	/**
	 * @method GetName: Return the name of the enum list
	 */
	public GetName() {
		return this.l_name;
	}
}
