// This file is part of MusicBrainz, the open internet music database.
// Copyright (C) 2014 MetaBrainz Foundation
// Licensed under the GPL version 2, or (at your option) any later version:
// http://www.gnu.org/licenses/gpl-2.0.txt

module("external links editor", {

    setup: function () {

        $("#qunit-fixture").append($.parseHTML('\
            <table id="external-links-editor">\
            <tbody data-bind="foreach: links()">\
              <tr data-bind="urlCleanup: \'artist\'">\
                <td>\
                  <select data-bind="value: linkTypeID, visible: showTypeSelection()">\
                    <option value=""> </option>\
                    <option value="179">Wikipedia</option>\
                    <option value="180">Discogs</option>\
                    <option value="181">MusicMoz</option>\
                    <option value="188">other databases</option>\
                  </select>\
                </td>\
                <td>\
                  <input type="text" data-bind="value: url" />\
                </td>\
              </tr>\
              <!-- ko with: error() -->\
              <tr>\
                <td class="errors" data-bind="text: $data"></td>\
              </tr>\
              <!-- /ko -->\
            </tbody>\
            </table>\
            <div id="external-link-bubble"></div>\
        '));

        MB.typeInfoByID = {
            179: {
                deprecated: false,
                phrase: "Wikipedia",
                type0: "artist",
                type1: "url",
                cardinality0: 0,
                cardinality1: 0
            },
            180: {
                deprecated: false,
                phrase: "Discogs",
                type0: "artist",
                type1: "url",
                cardinality0: 0,
                cardinality1: 0
            },
            181: {
                deprecated: true,
                phrase: "MusicMoz",
                type0: "artist",
                type1: "url",
                cardinality0: 0,
                cardinality1: 0
            },
            188: {
                deprecated: false,
                phrase: "other databases",
                type0: "artist",
                type1: "url",
                cardinality0: 0,
                cardinality1: 0
            }
        };

        MB.faviconClasses = { "wikipedia.org": "wikipedia" };

        this.addURL = function (name) {
            var source = this.viewModel.source;
            var target = MB.entity.URL({ name: name });
            var url = this.viewModel.getRelationship({ target: target }, source);

            source.relationships.push(url);

            return url;
        };

        this.viewModel = MB.Control.externalLinks.applyBindings({
            sourceData: { entityType: "artist", relationships: [] },
            formName: "edit-artist"
        });
    }
});


test("automatic link type detection for URL", function () {
    var url = this.addURL("http://en.wikipedia.org/wiki/No_Age");

    ok(url.matchesType(), "wikipedia page is detected");
    equal(url.faviconClass(), "wikipedia-favicon", "wikipedia favicon is used");
    equal(url.linkPhrase(), "Wikipedia", "wikipedia label is used");
    equal(url.linkTypeID(), 179, "internal link type is set to 179");
    equal(url.cleanup.typeControl.val(), 179, "option with value 179 is selected");
});


test("invalid URL detection", function () {
    var url = this.addURL("foo");

    ok(!!url.error(), "error is shown for invalid URL");

    url.cleanup.urlControl.val("http://en.wikipedia.org/wiki/No_Age").change();
    ok(!url.error(), "error is removed after valid URL is entered");
});


test("deprecated link type detection", function () {
    var url = this.addURL("http://musicmoz.org/Bands_and_Artists/B/Beatles,_The/");

    url.cleanup.typeControl.val(181).change();

    ok(!!url.error(), "error is shown for deprecated link type");

    url.cleanup.typeControl.val(188).change();
    ok(!url.error(), "error is removed after valid link type is selected");
});


test("hidden input data for form submission", function () {
    var source = this.viewModel.source;

    var existingURL = this.viewModel.getRelationship({
        id: 1,
        target: MB.entity.URL({ name: "http://en.wikipedia.org/wiki/Deerhunter" }),
        linkTypeID: 179
    }, source);

    var addedURL = this.viewModel.getRelationship({
        target: MB.entity.URL({ name: "http://rateyourmusic.com/artist/deerhunter" }),
        linkTypeID: 188
    }, source);

    existingURL.cleanup.urlControl.change();
    existingURL.cleanup.typeControl.change();

    source.relationships.push(addedURL);
    addedURL.cleanup.urlControl.change();
    addedURL.cleanup.typeControl.change();

    deepEqual(this.viewModel.hiddenInputs(), [
        { name: "edit-artist.url.0.relationship_id", value: 1 },
        { name: "edit-artist.url.0.text", value: "http://en.wikipedia.org/wiki/Deerhunter" },
        { name: "edit-artist.url.0.link_type_id", value: 179 },
        { name: "edit-artist.url.1.text", value: "http://rateyourmusic.com/artist/deerhunter" },
        { name: "edit-artist.url.1.link_type_id", value: 188 }
    ]);

    existingURL.cleanup.urlControl.val("http://en.wikipedia.org/wiki/dEErHuNtER").change();
    addedURL.remove();

    deepEqual(this.viewModel.hiddenInputs(), [
        { name: "edit-artist.url.0.relationship_id", value: 1 },
        { name: "edit-artist.url.0.text", value: "http://en.wikipedia.org/wiki/dEErHuNtER" },
        { name: "edit-artist.url.0.link_type_id", value: 179 }
    ]);

    existingURL.removed(true);

    deepEqual(this.viewModel.hiddenInputs(), [
        { name: "edit-artist.url.0.relationship_id", value: 1 },
        { name: "edit-artist.url.0.removed", value: 1 },
        { name: "edit-artist.url.0.text", value: "http://en.wikipedia.org/wiki/dEErHuNtER" },
        { name: "edit-artist.url.0.link_type_id", value: 179 }
    ]);
});