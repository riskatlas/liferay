	<div id="xmlimport">
		<form id="form_xmlimport" target="_new" enctype="multipart/form-data" name="newRecord" action="/php/metadata/?action=insert&profil=10&design=portal
" method="POST">
			<input type="hidden" value="99" name="standard" />
			<input type="hidden" value="1" name="public" />
			<div>
				<div>
					<label for="fileType">FileType</label>
					<select class="formelement" name="fileType">
						<option value="ISO19139">ISO 19139</option>
						<option value="ESRIdata">ESRI ISO metadata</option>
                        <option value="ISVS">ISVS</option>
                        <option value="FC">FC</option>
					</select>
				</div>
				<div>
					<label for="soubor">File</label>
					<input type="file" class="formelement" name="soubor" size="70">
				</div>
				<div>
					<label for="updateType">Existing record</label>
					<input type="radio" style="width: 20px;" class="formelement" checked="true" value="all" name="updateType"><span class="label">Overwrite</span>
					<input type="radio" style="width: 20px;" class="formelement" value="skip" name="updateType"><span class="label">Keep existing</span>
				</div>
				<div style="text-align: center; margin-top: 10px;">
					<input type="reset" />
					<button type="submit">Import</button>
				</div>
			</div>
		</form>
	</div>

	<div id="serviceimport">
		<form name="newRecord" enctype="multipart/form-data" target="_new" action="/php/metadata/?action=insert&profil=10&design=portal
" method="POST" id="form_service_import">
			<input type="hidden" value="99" name="standard">
			<div>
				<div>
					<label for="serviceType">Service type</label>
					<select class="formelement" name="serviceType">
						<option value="WMS">WMS</option>
						<option value="WFS">WFS</option>
						<option value="CSW">CSW</option>
					</select>
				</div>
				<div>
					<label for="url">URL</label>
					<input type="text" class="formelement" name="url" size="70">
				</div>
				<div>
					<label for="updateType">Existing record</label>
					<input type="radio" style="width: 20px;" class="formelement" checked="true" value="all" name="updateType"><span class="label">Overwrite</span>
					<input type="radio" style="width: 20px;" class="formelement" value="skip" name="updateType"><span class="label">Keep existing</span>
				</div>
				<div style="text-align: center; margin-top: 10px;">
					<input type="reset" />
					<button type="submit">Import</button>
				</div>
			</div>
		</form>
	</div>


