using System.Windows;
using System.Windows.Controls;

namespace btmc.src.ui.forms.main.components
{
    public partial class TextBoxWithToolsControl : UserControl
    {
        public static readonly DependencyProperty TextValueProperty =
            DependencyProperty.Register("TextValue", typeof(string), typeof(TextBoxWithToolsControl),
                new FrameworkPropertyMetadata(string.Empty, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty PlaceholderTextProperty =
            DependencyProperty.Register("PlaceholderText", typeof(string), typeof(TextBoxWithToolsControl),
                new PropertyMetadata("Enter text..."));

        public string TextValue
        {
            get { return (string)GetValue(TextValueProperty); }
            set { SetValue(TextValueProperty, value); }
        }

        public string PlaceholderText
        {
            get { return (string)GetValue(PlaceholderTextProperty); }
            set { SetValue(PlaceholderTextProperty, value); }
        }

        public TextBoxWithToolsControl()
        {
            InitializeComponent();
        }

        private void TextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            placeholder.Visibility = string.IsNullOrEmpty(textBox.Text) ? Visibility.Visible : Visibility.Collapsed;
        }

        private void TextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            placeholder.Visibility = Visibility.Collapsed;
        }

        private void TextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            placeholder.Visibility = string.IsNullOrEmpty(textBox.Text) ? Visibility.Visible : Visibility.Collapsed;
        }

        private void BtnCopy_Click(object sender, RoutedEventArgs e)
        {
            Clipboard.SetText(textBox.Text);
        }

        private void BtnPaste_Click(object sender, RoutedEventArgs e)
        {
            if (Clipboard.ContainsText())
            {
                textBox.Text = Clipboard.GetText();
            }
        }
    }
}